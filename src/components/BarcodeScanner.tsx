import { useEffect, useRef, useState } from 'react';
import { Icon } from './Icon';

type Detector = { detect: (source: CanvasImageSource) => Promise<Array<{ rawValue: string }>> };

declare global {
  interface Window {
    BarcodeDetector?: new (options?: { formats?: string[] }) => Detector;
  }
}

export function BarcodeScanner({ onDetected, onCancel }: { onDetected: (value: string) => void; onCancel: () => void }) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const frameRef = useRef<number | null>(null);
  const [error, setError] = useState('');
  const [manual, setManual] = useState('');
  const [cameraReady, setCameraReady] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function start() {
      if (!navigator.mediaDevices?.getUserMedia || !window.BarcodeDetector) {
        setError('Live barcode scanning is not supported in this browser. Enter the UPC below instead.');
        return;
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: 'environment' } }, audio: false });
        if (!mounted) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
          setCameraReady(true);
        }

        const detector = new window.BarcodeDetector({ formats: ['ean_13', 'ean_8', 'upc_a', 'upc_e'] });
        const scan = async () => {
          if (!mounted || !videoRef.current) return;
          try {
            const results = await detector.detect(videoRef.current);
            const value = results[0]?.rawValue;
            if (value) {
              onDetected(value);
              return;
            }
          } catch {
            // Keep scanning. Some browsers briefly throw while video frames initialize.
          }
          frameRef.current = window.requestAnimationFrame(scan);
        };
        frameRef.current = window.requestAnimationFrame(scan);
      } catch {
        setError('Camera access was not available. You can still type the UPC below.');
      }
    }

    start();
    return () => {
      mounted = false;
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      streamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, [onDetected]);

  return (
    <div className="scanner-wrap">
      <div className="scanner-view">
        <video ref={videoRef} muted playsInline />
        <div className="scanner-frame" aria-hidden="true"><span /><span /><span /><span /></div>
        {!cameraReady && <div className="scanner-placeholder"><Icon name="barcode" size={36} /><span>Point the camera at a UPC</span></div>}
      </div>
      {error && <p className="inline-note"><Icon name="info" size={17} /> {error}</p>}
      <div className="manual-barcode">
        <label htmlFor="manual-upc">Or enter the barcode</label>
        <div className="input-row">
          <input id="manual-upc" inputMode="numeric" autoComplete="off" placeholder="UPC / EAN" value={manual} onChange={(event) => setManual(event.target.value.replace(/\D/g, ''))} />
          <button className="small-primary" onClick={() => manual && onDetected(manual)} disabled={!manual}>Look up</button>
        </div>
      </div>
      <button className="text-button" onClick={onCancel}>Cancel</button>
    </div>
  );
}
