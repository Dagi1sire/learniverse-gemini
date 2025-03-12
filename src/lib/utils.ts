
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Function to get a placeholder image if an AI image is not available
export function getPlaceholderImage(topic: string) {
  return `https://placehold.co/600x400/e2e8f0/1e293b?text=${encodeURIComponent(topic)}`;
}

// Function to safely open a print dialog with specific content
export function printLesson(contentId: string) {
  const content = document.getElementById(contentId);
  
  if (!content) {
    console.error('Print content not found');
    return;
  }
  
  const printWindow = window.open('', '_blank');
  
  if (!printWindow) {
    console.error('Failed to open print window');
    return;
  }
  
  const printStyles = `
    @page { 
      size: portrait;
      margin: 1cm;
    }
    body { 
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
    }
    h1 { font-size: 24pt; margin: 0 0 10px 0; }
    h2 { font-size: 18pt; margin: 15px 0 10px 0; }
    h3 { font-size: 14pt; margin: 15px 0 8px 0; }
    p { margin: 0 0 10px 0; }
    .section { page-break-after: always; margin-bottom: 20px; }
    .section:last-child { page-break-after: avoid; }
    img { max-width: 100%; height: auto; }
  `;
  
  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Lesson Print</title>
        <style>${printStyles}</style>
      </head>
      <body>
        ${content.innerHTML}
      </body>
    </html>
  `);
  
  printWindow.document.close();
  
  // Wait for images to load before printing
  setTimeout(() => {
    printWindow.print();
    printWindow.close();
  }, 500);
}
