const codeurls = "https://raw.githubusercontent.com/hirotomoki12345/Qskill-auto/refs/heads/main/GUI.js";

fetch(codeurls)
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.text();
  })
  .then(scriptContent => {
    eval(scriptContent);
  })
  .catch(error => {
    console.error("エラーが発生しました:", error);
  });
