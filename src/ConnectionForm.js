import React, { useState } from 'react'

function ConnectionForm({ handleConnect, error }) {
  const [name, setName] = useState('')
  return (
    <div className="connection-form">
            <h2 className="prompt">Enter a username to connect to the world server:</h2>
            <form onSubmit={(e) => { e.preventDefault(); handleConnect(name); }}>
              <input
                type='text'
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder='Enter Your Name'
                required
              />
              <button type="submit">Connect</button>
            </form>
            {error && <p className="error">{error}</p>}
    </div>
  )
}

export default ConnectionForm