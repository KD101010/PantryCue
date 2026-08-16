import type { IScannerControls } from '@zxing/browser';
import { useEffect, useRef, useState } from 'react';
import { Icon } from './Icon';

function cleanBarcode(value: string): string | null {
  const digits = value.replace(/\D/g, '');
  return digits.length >= 8 && digits.length <= 14 ? digits : null;
}

export function BarcodeScanner({ onDetected, onCancel }: { onDetected: (value: string) => void; onCancel: () => void }) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const controlsRef = useRef<IScannerControls | null>(null);
  const onDetectedRef = useRef(onDetected);
  const detectedRef = useRef(false);
  const [error, setError] = useState('');
  const [manual, setManual] = useState('');
  const [cameraReady, setCameraReady] = useState(false);
  const [photoBusy, setPhotoBusy] = useState(false);

  useEffect(() => {
    onDetectedRef.current = onDetected;
  }, [onDetected]);

  useEffect(() => {
    let active = true;
    async function start() {
      if (!navigator.mediaDevices?.getUserMedia || !videoRef.current) {
        setError('This browser cannot open a live camera. You can scan a saved photo or type the numbers below.');
        return;
      }

      try {
        const { BrowserMultiFormatReader } = await import('@zxing/browser');
        const reader = new BrowserMultiFormatReader();
        const controls = await reader.decodeFromConstraints(
          {
            audio: false,
            video: {
              facingMode: { ideal: 'environment' },
              width: { ideal: 1280 },
              height: { ideal: 720 },
            },
          },
          videoRef.current,
          (result, _scanError, scanControls) => {
            if (!active || detectedRef.current || !result) return;
            const barcode = cleanBarcode(result.getText());
            if (!barcode) return;
            detectedRef.current = true;
            scanControls.stop();
            setCameraReady(false);
            onDetectedRef.current(barcode);
          },
        );

        if (!active) {
          controls.stop();
          return;
        }
        controlsRef.current = controls;
        setCameraReady(true);
        setError('');
      } catch (cameraError) {
        if (!active) return;
        const name = cameraError instanceof DOMException ? cameraError.name : '';
        setError(name === 'NotAllowedError'
          ? 'Camera permission was blocked. Allow camera access in your browser settings, or use a barcode photo or the number entry below.'
          : 'The live camera could not start. You can still scan a barcode photo or type the numbers below.');
      }
    }

    void start();
    return () => {
      active = false;
      controlsRef.current?.stop();
      controlsRef.current = null;
      const stream = videoRef.current?.srcObject;
      if (stream instanceof MediaStream) stream.getTracks().forEach((track) => track.stop());
    };
  }, []);

  const scanPhoto = async (file?: File) => {
    if (!file || photoBusy || detectedRef.current) return;
    setPhotoBusy(true);
    setError('');
    const url = URL.createObjectURL(file);
    try {
      const { BrowserMultiFormatReader } = await import('@zxing/browser');
      const result = await new BrowserMultiFormatReader().decodeFromImageUrl(url);
      const barcode = cleanBarcode(result.getText());
      if (!barcode) throw new Error('Not a UPC or EAN barcode');
      detectedRef.current = true;
      controlsRef.current?.stop();
      onDetectedRef.current(barcode);
    } catch {
      setError('I could not read a barcode in that photo. Try again with the full barcode sharp, bright, and filling most of the frame.');
    } finally {
      URL.revokeObjectURL(url);
      setPhotoBusy(false);
    }
  };

  return (
    <div className="scanner-wrap">
      <div className="scanner-view">
        <video ref={videoRef} muted playsInline aria-label="Live barcode camera" />
        <div className="scanner-frame" aria-hidden="true"><span /><span /><span /><span /></div>
        {!cameraReady && <div className="scanner-placeholder"><Icon name="barcode" size={36} /><span>{error ? 'Use a photo or the numbers below' : 'Starting the rear camera...'}</span></div>}
        {cameraReady && <div className="scanner-guidance">Hold steady with the whole barcode inside the frame</div>}
      </div>
      {error && <p className="inline-note" role="status"><Icon name="info" size={17} /> {error}</p>}
      <label className="secondary-button full-width file-input barcode-photo-input">
        <Icon name="camera" size={18} /> {photoBusy ? 'Reading photo...' : 'Scan a barcode photo'}
        <input
          type="file"
          accept="image/*"
          capture="environment"
          disabled={photoBusy}
          onChange={(event) => {
            void scanPhoto(event.target.files?.[0]);
            event.currentTarget.value = '';
          }}
        />
      </label>
      <div className="manual-barcode">
        <label htmlFor="manual-upc">Or enter the UPC / EAN numbers</label>
        <div className="input-row">
          <input id="manual-upc" inputMode="numeric" autoComplete="off" placeholder="Example: 012345678905" value={manual} onChange={(event) => setManual(event.target.value.replace(/\D/g, ''))} />
          <button className="small-primary" onClick={() => {
            const barcode = cleanBarcode(manual);
            if (!barcode || detectedRef.current) return;
            detectedRef.current = true;
            controlsRef.current?.stop();
            onDetectedRef.current(barcode);
          }} disabled={!cleanBarcode(manual)}>Look up</button>
        </div>
        {manual.length > 0 && !cleanBarcode(manual) && <small>Enter the 8 to 14 digits printed below the barcode.</small>}
      </div>
      <button className="text-button" onClick={onCancel}>Cancel</button>
    </div>
  );
}
