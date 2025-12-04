import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';

function App() {
    const [status, setStatus] = useState('Idle');
    const [response, setResponse] = useState(null);
    const [running, setRunning] = useState(false);
    const [view] = useState('main');
    const [layout] = useState(localStorage.getItem('layout') || 'normal');

    useEffect(() => {
        window._reactAppApi = {
            setStatus: s => setStatus(String(s)),
            setResponse: r => setResponse(r),
            getCurrentView: () => view,
            getLayoutMode: () => layout,
            handleStart: () => {
                setRunning(true);
                if (window.cheddar && typeof window.cheddar.startCapture === 'function') {
                    window.cheddar.startCapture();
                }
            },
            handleStop: () => {
                setRunning(false);
                if (window.cheddar && typeof window.cheddar.stopCapture === 'function') {
                    window.cheddar.stopCapture();
                }
            },
        };

        return () => { try { delete window._reactAppApi; } catch (e) {} };
    }, [view, layout]);

    return (
        React.createElement('div', { style: { color: 'var(--text-color)', padding: 16 } },
            React.createElement('header', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 } },
                React.createElement('div', null,
                    React.createElement('strong', null, 'Cheating Daddy'),
                    React.createElement('div', { style: { fontSize: 12, color: 'var(--description-color)' } }, window.randomDisplayName || '')
                ),
                React.createElement('div', null,
                    React.createElement('span', { style: { marginRight: 12, fontSize: 13 } }, `Status: ${status}`),
                    running ? React.createElement('button', { onClick: () => { window._reactAppApi.handleStop(); }, style: { padding: '6px 10px' } }, 'Stop') : React.createElement('button', { onClick: () => { window._reactAppApi.handleStart(); }, style: { padding: '6px 10px' } }, 'Start')
                )
            ),

            React.createElement('main', { style: { display: 'grid', gridTemplateColumns: '1fr 320px', gap: 12 } },
                React.createElement('section', { style: { background: 'var(--main-content-background)', padding: 12, borderRadius: 'var(--content-border-radius)' } },
                    React.createElement('h3', null, 'Capture Controls'),
                    React.createElement('p', { style: { color: 'var(--description-color)' } }, 'Use the Start button to begin automated capture and audio forwarding.'),
                    React.createElement('div', null,
                        React.createElement('label', { style: { marginRight: 8 } }, 'Interval (s):'),
                        React.createElement('input', { type: 'number', defaultValue: 5, min: 1, style: { width: 80 } })
                    ),
                    React.createElement('div', { style: { marginTop: 8 } },
                        React.createElement('button', { onClick: () => { window.captureManualScreenshot && window.captureManualScreenshot(); }, style: { padding: '6px 10px' } }, 'Manual Screenshot')
                    )
                ),

                React.createElement('aside', { style: { background: 'rgba(0,0,0,0.6)', padding: 12, borderRadius: 'var(--content-border-radius)' } },
                    React.createElement('h4', null, 'Response Preview'),
                    React.createElement('div', { style: { whiteSpace: 'pre-wrap', color: 'var(--description-color)', maxHeight: 300, overflow: 'auto' } }, response || 'No response yet')
                )
            )
        )
    );
}

const rootEl = document.getElementById('cheddar-root');
if (rootEl) {
    createRoot(rootEl).render(React.createElement(App));
} else {
    console.error('React mount point #cheddar-root not found');
}
