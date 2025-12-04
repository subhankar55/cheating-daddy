// Simple React UI mounted via UMD globals (React, ReactDOM)
(function () {
    const e = React.createElement;

    function App() {
        const [status, setStatus] = React.useState('Idle');
        const [response, setResponse] = React.useState(null);
        const [running, setRunning] = React.useState(false);
        const [view, setView] = React.useState('main');
        const [layout, setLayout] = React.useState(localStorage.getItem('layout') || 'normal');

        // Expose API for renderer.js to call
        React.useEffect(() => {
            window._reactAppApi = {
                setStatus: s => setStatus(String(s)),
                setResponse: r => setResponse(r),
                getCurrentView: () => view,
                getLayoutMode: () => layout,
                handleStart: () => {
                    // UI-level start indicator
                    setRunning(true);
                    // Call into renderer's startCapture if available
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

            // Cleanup on unmount
            return () => {
                try { delete window._reactAppApi; } catch (e) {}
            };
        }, [view, layout]);

        return e('div', { style: { color: 'var(--text-color)', padding: 16 } },
            e('header', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 } },
                e('div', null,
                    e('strong', null, 'Cheating Daddy'),
                    e('div', { style: { fontSize: 12, color: 'var(--description-color)' } }, window.randomDisplayName || '')
                ),
                e('div', null,
                    e('span', { style: { marginRight: 12, fontSize: 13 } }, `Status: ${status}`),
                    running ? e('button', { onClick: () => { window._reactAppApi.handleStop(); }, style: { padding: '6px 10px' } }, 'Stop') : e('button', { onClick: () => { window._reactAppApi.handleStart(); }, style: { padding: '6px 10px' } }, 'Start')
                )
            ),

            e('main', { style: { display: 'grid', gridTemplateColumns: '1fr 320px', gap: 12 } },
                e('section', { style: { background: 'var(--main-content-background)', padding: 12, borderRadius: 'var(--content-border-radius)' } },
                    e('h3', null, 'Capture Controls'),
                    e('p', { style: { color: 'var(--description-color)' } }, 'Use the Start button to begin automated capture and audio forwarding.'),
                    e('div', null,
                        e('label', { style: { marginRight: 8 } }, 'Interval (s):'),
                        e('input', { type: 'number', defaultValue: 5, min: 1, style: { width: 80 } })
                    ),
                    e('div', { style: { marginTop: 8 } },
                        e('button', { onClick: () => { window.captureManualScreenshot && window.captureManualScreenshot(); }, style: { padding: '6px 10px' } }, 'Manual Screenshot')
                    )
                ),

                e('aside', { style: { background: 'rgba(0,0,0,0.6)', padding: 12, borderRadius: 'var(--content-border-radius)' } },
                    e('h4', null, 'Response Preview'),
                    e('div', { style: { whiteSpace: 'pre-wrap', color: 'var(--description-color)', maxHeight: 300, overflow: 'auto' } }, response || 'No response yet')
                )
            )
        );
    }

    // Mount app
    try {
        const root = document.getElementById('cheddar-root');
        if (root) {
            ReactDOM.createRoot(root).render(React.createElement(App));
        } else {
            console.error('React mount point #cheddar-root not found');
        }
    } catch (err) {
        console.error('Failed to mount React app', err);
    }
})();
