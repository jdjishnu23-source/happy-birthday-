/**
 * High-Resolution Birthday Keepsake Card Generator & Downloader.
 * Generates a beautiful 1200x1600px PNG card and triggers browser download.
 */

export const downloadBirthdayCard = async (): Promise<boolean> => {
  return new Promise((resolve) => {
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(false);
        return;
      }

      // 1200x1600 High Definition Card
      canvas.width = 1200;
      canvas.height = 1600;

      // 1. Background Gradient (Soft Pink to Rose & Peach)
      const gradient = ctx.createLinearGradient(0, 0, 1200, 1600);
      gradient.addColorStop(0, '#fdf2f8');
      gradient.addColorStop(0.3, '#fce7f3');
      gradient.addColorStop(0.7, '#fff1f2');
      gradient.addColorStop(1, '#ffe4e6');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 1200, 1600);

      // 2. Decorative Double Outer Border
      ctx.strokeStyle = '#f43f5e';
      ctx.lineWidth = 10;
      ctx.strokeRect(40, 40, 1120, 1520);

      ctx.strokeStyle = '#fbcfe8';
      ctx.lineWidth = 4;
      ctx.strokeRect(55, 55, 1090, 1490);

      // Corner ornaments
      const corners = [
        [75, 75],
        [1125, 75],
        [75, 1525],
        [1125, 1525],
      ];
      ctx.fillStyle = '#e11d48';
      ctx.font = '36px sans-serif';
      ctx.textAlign = 'center';
      corners.forEach(([x, y]) => {
        ctx.fillText('💖', x, y);
      });

      // 3. Header Text
      ctx.textAlign = 'center';
      ctx.fillStyle = '#9f1239';
      ctx.font = 'bold italic 68px "Dancing Script", cursive, serif';
      ctx.fillText('Happy Birthday,', 600, 160);

      ctx.fillStyle = '#be123c';
      ctx.font = '900 110px "Playfair Display", Georgia, serif';
      ctx.fillText('AKKA', 600, 275);

      ctx.fillStyle = '#e11d48';
      ctx.font = 'italic 34px sans-serif';
      ctx.fillText('✨ You are so special & deeply cherished ✨', 600, 340);

      // Helper function to draw message and finish download
      const finishDrawing = (imgLoaded: boolean, img?: HTMLImageElement) => {
        // Center Illustration area
        if (imgLoaded && img) {
          ctx.save();
          // Draw rounded card background for the artwork
          ctx.fillStyle = '#ffffff';
          ctx.shadowColor = 'rgba(244, 63, 94, 0.2)';
          ctx.shadowBlur = 30;
          ctx.beginPath();
          ctx.roundRect(300, 400, 600, 500, 30);
          ctx.fill();
          ctx.restore();

          // Draw the illustration centered
          ctx.drawImage(img, 320, 420, 560, 460);
        } else {
          // Fallback floral heart
          ctx.font = '160px sans-serif';
          ctx.fillText('🎂💖🌹', 600, 660);
        }

        // 4. Loving Letter Section
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = 'rgba(244, 63, 94, 0.15)';
        ctx.shadowBlur = 20;
        ctx.beginPath();
        ctx.roundRect(120, 960, 960, 460, 24);
        ctx.fill();

        ctx.strokeStyle = '#fecdd3';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = '#881337';
        ctx.font = 'bold 36px "Playfair Display", serif';
        ctx.fillText('A Message From The Heart 💕', 600, 1020);

        ctx.fillStyle = '#374151';
        ctx.font = '28px Georgia, serif';
        const lines = [
          'Happy Birthday to someone truly special! 🎂',
          '',
          'You are Sweet Soul, Super Loyal, My Rock, and I am so grateful to have you in my life.',
          'You bring so much warmth, smiles, and sweetness into my days.',
          'Every moment with you is precious.',
          '',
          'Wishing you endless happiness, boundless love, and all the joy you deserve!',
          '',
          'With lots of love and best wishes, Your Special Someone ❤️'
        ];

        let lineY = 1080;
        lines.forEach((line) => {
          ctx.fillText(line, 600, lineY);
          lineY += 34;
        });

        // 5. Footer Tamil / English greeting
        ctx.fillStyle = '#9f1239';
        ctx.font = 'bold 32px sans-serif';
        ctx.fillText('அக்காவுக்கு இனிய பிறந்தநாள் நல்வாழ்த்துகள்! 🌸', 600, 1490);

        // Convert to blob and download
        canvas.toBlob((blob) => {
          if (!blob) {
            resolve(false);
            return;
          }
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `Happy_Birthday_AKKA_${new Date().getFullYear()}.png`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          setTimeout(() => URL.revokeObjectURL(url), 2000);
          resolve(true);
        }, 'image/png');
      };

      // Try loading the Brown & Cony celebration image
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => finishDrawing(true, img);
      img.onerror = () => finishDrawing(false);
      img.src = '/assets/aistudio/image_4882cb71.png';
    } catch {
      resolve(false);
    }
  });
};
