const inputText = document.getElementById("inputText");
const styleSelect = document.getElementById("style");
const generateBtn = document.getElementById("generateBtn");
const copyBtn = document.getElementById("copyBtn");
const output = document.getElementById("output");

generateBtn.addEventListener("click", async () => {
  const text = inputText.value.trim();

  if (!text) {
    output.textContent = "Pehle upar text paste karo.";
    return;
  }

  generateBtn.disabled = true;
  generateBtn.textContent = "Ban rahe hain...";
  output.textContent = "AI notes bana raha hai, thoda ruko...";

  try {
    const response = await fetch("/api/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: text, style: styleSelect.value }),
    });

    if (!response.ok) {
      const data = await response.json();
      output.textContent = data.error || "Kuch galat ho gaya.";
    } else {
      output.textContent = "";
      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        output.textContent += decoder.decode(value, { stream: true });
      }
    }
  } catch (error) {
    output.textContent = "Server se connect nahi ho paaya. Terminal check karo.";
  } finally {
    generateBtn.disabled = false;
    generateBtn.textContent = "Generate Notes";
  }
});

copyBtn.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(output.textContent);
    copyBtn.textContent = "Copied!";
    setTimeout(() => (copyBtn.textContent = "Copy"), 1500);
  } catch (error) {
    copyBtn.textContent = "Copy nahi hua";
    setTimeout(() => (copyBtn.textContent = "Copy"), 1500);
  }
});