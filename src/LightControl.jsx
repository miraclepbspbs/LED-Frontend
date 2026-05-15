import { useState, useEffect } from 'react'
import './style.css'

function LightControl() {
  const [state, setState] = useState({
    power: false,
    brightness: 50,
    color: '#00ff00',
    rgb: { r: 0, g: 255, b: 0 },
    blinkMode: 'none'
  })

  const [statusText, setStatusText] = useState('未连接')
  const [lastUpdate, setLastUpdate] = useState('--')
  const [isLoading, setIsLoading] = useState(false)

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'
  const healthUrl = `${apiBaseUrl}/health`
  const statusUrl = `${apiBaseUrl}/api/led/status`

  // Check backend health on mount
  useEffect(() => {
    checkBackendHealth()
  }, [])

  const checkBackendHealth = async () => {
    try {
      const response = await fetch(healthUrl)
      if (response.ok) {
        const data = await response.json()
        console.log('Backend health check:', data)
        updateStatus('后端服务正常', false)
        return true
      } else {
        throw new Error('Health check failed')
      }
    } catch (error) {
      console.error('Backend health check failed:', error)
      updateStatus('后端服务未连接', false)
      return false
    }
  }

  const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 }
  }

  const updateStatus = (message, loading = false) => {
    setStatusText(message)
    setIsLoading(loading)
  }

  const updateLastUpdateTime = () => {
    const now = new Date()
    setLastUpdate(now.toLocaleTimeString('zh-CN'))
  }

  const handlePowerChange = (e) => {
    setState(prev => ({
      ...prev,
      power: e.target.checked
    }))
  }

  const handleBrightnessChange = (e) => {
    const brightness = parseInt(e.target.value)
    setState(prev => ({
      ...prev,
      brightness
    }))
  }

  const handleColorChange = (e) => {
    const color = e.target.value
    const rgb = hexToRgb(color)
    setState(prev => ({
      ...prev,
      color,
      rgb
    }))
  }

  const handleBlinkModeChange = (e) => {
    setState(prev => ({
      ...prev,
      blinkMode: e.target.value
    }))
  }

  const applySettings = async () => {
    try {
      updateStatus('应用设置中...', true)
      
      const lightData = {
        state: state.power ? 'on' : 'off',
        brightness: state.brightness,
        color: state.color,
        blinkMode: state.blinkMode
      }

      console.log('Sending light settings:', lightData)

      const response = await fetch(statusUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(lightData)
      })

      if (response.ok) {
        const result = await response.json()
        updateStatus('设置已成功应用', false)
        updateLastUpdateTime()
        console.log('Settings applied successfully:', result)
      } else {
        throw new Error(`Server responded with status: ${response.status}`)
      }
    } catch (error) {
      console.error('Error applying settings:', error)
      updateStatus(`应用失败: ${error.message}`, false)
    }
  }

  const resetSettings = () => {
    setState({
      power: false,
      brightness: 50,
      color: '#00ff00',
      rgb: { r: 0, g: 255, b: 0 },
      blinkMode: 'none'
    })
    updateStatus('设置已重置')
  }

  return (
    <div className="container">
      <h1>🔆 小灯控制系统</h1>
      
      <div className="control-panel">
        {/* Power Switch */}
        <div className="control-section">
          <label className="switch-label">
            <span>电源状态</span>
            <label className="toggle-switch">
              <input 
                type="checkbox" 
                id="powerSwitch"
                checked={state.power}
                onChange={handlePowerChange}
              />
              <span className="slider"></span>
            </label>
          </label>
        </div>

        {/* Brightness Control */}
        <div className="control-section">
          <label htmlFor="brightnessSlider">亮度: <span id="brightnessValue">{state.brightness}</span>%</label>
          <input 
            type="range" 
            id="brightnessSlider" 
            min="0" 
            max="100" 
            value={state.brightness}
            onChange={handleBrightnessChange}
          />
        </div>

        {/* Color Picker (RGB) */}
        <div className="control-section">
          <label htmlFor="colorPicker">灯光颜色 (RGB)</label>
          <div className="color-picker-wrapper">
            <input 
              type="color" 
              id="colorPicker" 
              value={state.color}
              onChange={handleColorChange}
            />
            <div 
              className="color-preview" 
              id="colorPreview"
              style={{ backgroundColor: state.color }}
            ></div>
          </div>
          <div className="rgb-display" id="rgbDisplay">
            R: {state.rgb.r}, G: {state.rgb.g}, B: {state.rgb.b}
          </div>
        </div>

        {/* Blink Mode */}
        <div className="control-section">
          <label htmlFor="blinkMode">闪烁模式</label>
          <select 
            id="blinkMode"
            value={state.blinkMode}
            onChange={handleBlinkModeChange}
          >
            <option value="none">常亮</option>
            <option value="slow">慢闪 (1秒)</option>
            <option value="fast">快闪 (0.5秒)</option>
            <option value="strobe">频闪 (0.1秒)</option>
            <option value="breath">呼吸灯</option>
          </select>
        </div>

        {/* Control Buttons */}
        <div className="control-section button-section">
          <button id="applyBtn" className="btn btn-primary" onClick={applySettings}>
            应用设置
          </button>
          <button id="resetBtn" className="btn btn-secondary" onClick={resetSettings}>
            重置
          </button>
        </div>

        {/* Status Display */}
        <div className="status-section">
          <h3>当前状态</h3>
          <div className="status-info" id="statusInfo">
            <p>状态: <span 
              id="statusText" 
              style={{ 
                color: isLoading ? '#ff9800' : (statusText.includes('失败') || statusText.includes('未连接') ? '#f44336' : '#4caf50')
              }}
            >
              {statusText}
            </span></p>
            <p>最后更新: <span id="lastUpdate">{lastUpdate}</span></p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LightControl
