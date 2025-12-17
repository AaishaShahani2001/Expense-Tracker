import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export const exportPDF = async (transactions) => {
  const pdf = new jsPDF();
  pdf.text("Expense Report", 14, 10);

  let y = 20;

  transactions.forEach((tx, index) => {
    pdf.text(
      `${index + 1}. ${tx.title} - ${tx.category} - Rs.${tx.amount}`,
      14,
      y
    );
    y += 8;

    if (y > 280) {
      pdf.addPage();
      y = 20;
    }
  });

  pdf.save("expense-report.pdf");
};
