import fs from 'fs';

try {
  fs.copyFileSync("C:\\Users\\mjk80\\CrossDevice\\Jk\\storage\\Android\\media\\com.whatsapp\\WhatsApp\\Media\\WhatsApp Documents\\Kaggadasapura.csv", "c:\\Users\\mjk80\\OneDrive\\Desktop\\rent project\\Kaggadasapura.csv");
  console.log("Copied successfully");
} catch (error) {
  console.error("Error:", error.message);
}
