import { useState } from 'react'
import './style.css'

function PidControl() {
  const [pidParams, setPidParams] = useState({
    kp: 1.0,
    ki: 0.1,
    kd: 0.01,
    targetValue: 100,
    sampleTime: 0.1
  })

  const [statusText, setStatusText] = useState('未连接')
  const [isLoading, setIsLoading] = useState(false)

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'
  const pidUrl = `${apiBaseUrl}/api/pid`

  const handleParamChange = (param, value) => {
    setPidParams(prev => ({
      ...prev,
      [param]: parseFloat(value)
    }))
  }

  const updateStatus = (message, loading = false) => {
    setStatusText(message)
    setIsLoading(loading)
  }

  const applyPidSettings = async () => {
    try {
      updateStatus('应用PID参数中...', true)
      
      const pidData = {
        kp: pidParams.kp,
        ki: pidParams.ki,
        kd: pidParams.kd,
        targetValue: pidParams.targetValue,
        sampleTime: pidParams.sampleTime
      }

      console.log('Sending PID parameters:', pidData)

      const response = await fetch(pidUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(pidData)
      })

      if (response.ok) {
        const result = await response.json()
        updateStatus('PID参数已成功应用', false)
        console.log('PID settings applied successfully:', result)
      } else {
        throw new Error(`Server responded with status: ${response.status}`)
      }
    } catch (error) {
      console.error('Error applying PID settings:', error)
      updateStatus(`应用失败: ${error.message}`, false)
    }
  }
  const savePID = async (p, i, d) => {
    await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/pid`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ p, i, d })
    });
  };
  const resetPidSettings = () => {
    setPidParams({
      kp: 1.0,
      ki: 0.1,
      kd: 0.01,
      targetValue: 100,
      sampleTime: 0.1
    })
    updateStatus('PID参数已重置')
  }

  return (
    <div className="container">
      <h1>⚙️ PID 参数控制</h1>
      
      <div className="control-panel">
        {/* Kp Parameter */}
        <div className="control-section">
          <label htmlFor="kpSlider">比例系数 (Kp): {pidParams.kp.toFixed(2)}</label>
          <input 
            type="range" 
            id="kpSlider" 
            min="0" 
            max="10" 
            step="0.01"
            value={pidParams.kp}
            onChange={(e) => handleParamChange('kp', e.target.value)}
          />
        </div>

        {/* Ki Parameter */}
        <div className="control-section">
          <label htmlFor="kiSlider">积分系数 (Ki): {pidParams.ki.toFixed(2)}</label>
          <input 
            type="range" 
            id="kiSlider" 
            min="0" 
            max="5" 
            step="0.01"
            value={pidParams.ki}
            onChange={(e) => handleParamChange('ki', e.target.value)}
          />
        </div>

        {/* Kd Parameter */}
        <div className="control-section">
          <label htmlFor="kdSlider">微分系数 (Kd): {pidParams.kd.toFixed(2)}</label>
          <input 
            type="range" 
            id="kdSlider" 
            min="0" 
            max="2" 
            step="0.01"
            value={pidParams.kd}
            onChange={(e) => handleParamChange('kd', e.target.value)}
          />
        </div>

        {/* Target Value */}
        <div className="control-section">
          <label htmlFor="targetValue">目标值: {pidParams.targetValue}</label>
          <input 
            type="range" 
            id="targetValue" 
            min="0" 
            max="1000" 
            step="1"
            value={pidParams.targetValue}
            onChange={(e) => handleParamChange('targetValue', e.target.value)}
          />
        </div>

        {/* Sample Time */}
        <div className="control-section">
          <label htmlFor="sampleTime">采样时间 (秒): {pidParams.sampleTime.toFixed(2)}</label>
          <input 
            type="range" 
            id="sampleTime" 
            min="0.01" 
            max="1" 
            step="0.01"
            value={pidParams.sampleTime}
            onChange={(e) => handleParamChange('sampleTime', e.target.value)}
          />
        </div>

        {/* Control Buttons */}
        <div className="control-section button-section">
          <button className="btn btn-primary" onClick={applyPidSettings}>
            应用PID参数
          </button>
          <button className="btn btn-secondary" onClick={resetPidSettings}>
            重置
          </button>
        </div>

        {/* Status Display */}
        <div className="status-section">
          <h3>当前状态</h3>
          <div className="status-info">
            <p>状态: <span 
              style={{ 
                color: isLoading ? '#ff9800' : (statusText.includes('失败') || statusText.includes('未连接') ? '#f44336' : '#4caf50')
              }}
            >
              {statusText}
            </span></p>
          </div>
        </div>

        {/* Current Parameters Display */}
        <div className="status-section">
          <h3>当前参数</h3>
          <div className="status-info">
            <p>Kp: <span>{pidParams.kp.toFixed(2)}</span></p>
            <p>Ki: <span>{pidParams.ki.toFixed(2)}</span></p>
            <p>Kd: <span>{pidParams.kd.toFixed(2)}</span></p>
            <p>目标值: <span>{pidParams.targetValue}</span></p>
            <p>采样时间: <span>{pidParams.sampleTime.toFixed(2)}s</span></p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PidControl
