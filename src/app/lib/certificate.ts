import { jsPDF } from "jspdf";

export interface CertificateData {
  name: string;
  courseTitle: string;
  dateLabel: string;
  scoreLabel: string;
  certId: string;
}

// Generates and downloads a soft-copy certificate as a vector PDF (A4
// landscape). Kept fully client-side so it works without a backend; a
// production setup may prefer a server-issued, verifiable certificate.
export const generateCertificatePdf = (data: CertificateData) => {
  const doc = new jsPDF({ orientation: "landscape", unit: "pt", format: "a4" });
  const W = doc.internal.pageSize.getWidth();
  const H = doc.internal.pageSize.getHeight();
  const cx = W / 2;

  // Background
  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, W, H, "F");

  // Outer border (slate-900) + thin amber accent inside
  doc.setDrawColor(15, 23, 42);
  doc.setLineWidth(3);
  doc.rect(24, 24, W - 48, H - 48, "S");
  doc.setDrawColor(245, 158, 11);
  doc.setLineWidth(1);
  doc.rect(34, 34, W - 68, H - 68, "S");

  // Brand
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(15, 23, 42);
  doc.text("WORKERVET", cx, 84, { align: "center" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(120, 130, 145);
  doc.text("WORKPLACE READINESS CERTIFICATION", cx, 100, { align: "center" });

  // Title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(34);
  doc.setTextColor(15, 23, 42);
  doc.text("Certificate of Completion", cx, 165, { align: "center" });

  // Accent rule
  doc.setDrawColor(79, 70, 229);
  doc.setLineWidth(2);
  doc.line(cx - 70, 182, cx + 70, 182);

  // Body
  doc.setFont("helvetica", "normal");
  doc.setFontSize(13);
  doc.setTextColor(90, 100, 115);
  doc.text("This is to certify that", cx, 225, { align: "center" });

  doc.setFont("helvetica", "bold");
  doc.setFontSize(30);
  doc.setTextColor(15, 23, 42);
  doc.text(data.name, cx, 268, { align: "center" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(13);
  doc.setTextColor(90, 100, 115);
  doc.text("has successfully completed the training course", cx, 305, { align: "center" });

  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor(79, 70, 229);
  doc.text(data.courseTitle, cx, 338, { align: "center" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.setTextColor(90, 100, 115);
  doc.text(`Final assessment score: ${data.scoreLabel}`, cx, 368, { align: "center" });

  // Footer: date (left) and signature (right)
  const baseY = H - 90;
  doc.setDrawColor(180, 188, 200);
  doc.setLineWidth(1);
  doc.line(90, baseY, 250, baseY);
  doc.line(W - 250, baseY, W - 90, baseY);

  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text(data.dateLabel, 170, baseY + 18, { align: "center" });
  doc.text("Workervet", W - 170, baseY + 18, { align: "center" });

  doc.setFontSize(8);
  doc.setTextColor(120, 130, 145);
  doc.text("DATE", 170, baseY + 32, { align: "center" });
  doc.text("AUTHORISED SIGNATURE", W - 170, baseY + 32, { align: "center" });

  // Certificate id
  doc.setFontSize(8);
  doc.setTextColor(150, 158, 170);
  doc.text(`Certificate ID: ${data.certId}`, cx, H - 44, { align: "center" });

  const safeCourse = data.courseTitle.replace(/[^a-z0-9]+/gi, "-").toLowerCase();
  doc.save(`workervet-certificate-${safeCourse}.pdf`);
};
