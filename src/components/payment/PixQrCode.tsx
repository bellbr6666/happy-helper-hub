import { useEffect, useState } from "react";
import QRCode from "qrcode";

type PixQrCodeProps = {
  pixCode: string;
  qrCodeUrl?: string;
  className?: string;
};

export function PixQrCode({ pixCode, qrCodeUrl, className }: PixQrCodeProps) {
  const [fallbackDataUrl, setFallbackDataUrl] = useState<string>("");
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function generateFallback() {
      try {
        const generated = await QRCode.toDataURL(pixCode, {
          width: 320,
          margin: 1,
          errorCorrectionLevel: "M",
        });

        if (isMounted) {
          setFallbackDataUrl(generated);
        }
      } catch {
        if (isMounted) {
          setFallbackDataUrl("");
        }
      }
    }

    if (pixCode) {
      generateFallback();
    }

    return () => {
      isMounted = false;
    };
  }, [pixCode]);

  const srcToShow = !imageError && qrCodeUrl ? qrCodeUrl : fallbackDataUrl;

  if (!srcToShow) {
    return (
      <div className="grid h-44 w-44 place-items-center rounded-md bg-muted text-xs text-muted-foreground">
        QR Code indisponível
      </div>
    );
  }

  return (
    <img
      src={srcToShow}
      alt="QR Code Pix para pagamento"
      className={className ?? "h-44 w-44 rounded-md"}
      onError={() => setImageError(true)}
      loading="eager"
    />
  );
}
