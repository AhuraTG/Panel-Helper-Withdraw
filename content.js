(function () {
  let activePanel = null;

  // ===== W PANEL =====
  (function () {
    let panelVisible = false;
    let selectedBet = null;
    let lastCopiedNumber = "";
    let textarea = null;
    const requiredWords = ["Amount", "Card", "Saba", "Bank"];

    function createCircleButton({ label, bottom, bg }) {
      const b = document.createElement("div");
      Object.assign(b.style, {
        position: "fixed",
        left: "15px",
        bottom,
        width: "50px",
        height: "50px",
        borderRadius: "50%",
        backgroundColor: bg,
        color: "#000",
        fontWeight: "bold",
        fontSize: "24px",
        display: "none",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        zIndex: "10001",
        userSelect: "none",
      });
      b.innerText = label;
      document.body.appendChild(b);
      return b;
    }

    const wButton = createCircleButton({ label: "W", bottom: "15px", bg: "gold" });
    const panel = document.createElement("div");

    Object.assign(panel.style, {
      position: "fixed",
      left: "75px",
      bottom: "15px",
      width: "220px",
      backgroundColor: "gold",
      color: "#000",
      borderRadius: "8px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
      padding: "12px",
      fontSize: "12px",
      display: "none",
      zIndex: "10002",
    });

    document.body.append(panel);
    window.wPanelInstance = panel;

    function getFieldValue(label) {
      const fields = Array.from(document.querySelectorAll(".field_name"));
      for (const f of fields) {
        if (f.innerText.includes(label)) {
          const next = f.nextElementSibling;
          return next ? next.innerText.trim() || next.value || "" : "";
        }
      }
      return "";
    }

    document.addEventListener("copy", () => {
      const sel = window.getSelection().toString().trim();
      if (/^\d+(\.\d+)?$/.test(sel)) {
        localStorage.setItem("LAST_COPIED_NUMBER", sel);
      }
    });

    function renderBetOptions() {
      panel.innerHTML = "";
      if (!selectedBet) {
        ["JET BET", "ACE BET"].forEach((t) => {
          const btn = document.createElement("button");
          btn.innerText = t;
          Object.assign(btn.style, {
            width: "100%",
            marginBottom: "6px",
            padding: "6px",
            cursor: "pointer",
            backgroundColor: "#0fa34a",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            fontWeight: "bold",
            fontSize: "14px",
          });
          btn.onclick = () => {
            selectedBet = t.split(" ")[0];
            updateTextarea();
          };
          panel.appendChild(btn);
        });
      }
    }

    function updateTextarea() {
      panel.innerHTML = "";
      lastCopiedNumber = localStorage.getItem("LAST_COPIED_NUMBER") || "";

      if (!selectedBet) {
        renderBetOptions();
        return;
      }

      textarea = document.createElement("textarea");
      textarea.readOnly = true;
      Object.assign(textarea.style, {
        width: "100%",
        height: "190px",
        padding: "6px",
        fontSize: "16px",
        borderRadius: "6px",
        resize: "none",
        backgroundColor: "#fff",
        color: "#000",
        marginBottom: "6px",
      });

      textarea.value = [
        `P. ${selectedBet}`,
        `U. ${lastCopiedNumber}`,
        `ID. ${getFieldValue("Id")}`,
        `$. ${getFieldValue("Amount")}`,
        `Z. ${getFieldValue("Process Time")}`,
        `${getFieldValue("Card")}`,
        `N. ${getFieldValue("Name")}`,
        `G. ${getFieldValue("gateway")}`,
      ].join("\n");

      panel.appendChild(textarea);

      const copyBtn = document.createElement("button");
      copyBtn.innerText = "Copy";
      Object.assign(copyBtn.style, {
        width: "100%",
        padding: "6px",
        cursor: "pointer",
        backgroundColor: "#0fa34a",
        color: "#fff",
        border: "none",
        borderRadius: "4px",
        fontWeight: "bold",
        fontSize: "14px",
      });
      copyBtn.onclick = async () => {
        await navigator.clipboard.writeText(textarea.value);
        copyBtn.innerText = "Copied!";
        setTimeout(() => (copyBtn.innerText = "Copy"), 2000);
      };
      panel.appendChild(copyBtn);
    }

    wButton.onclick = () => {
      // بستن پنل $ اگر باز است
      if (window.dollarPanelInstance && window.dollarPanelInstance.style.display === "block") {
        window.dollarPanelInstance.style.display = "none";
      }

      if (panel.style.display === "block") {
        panel.style.display = "none";
        activePanel = null;
        return;
      }
      panel.style.display = "block";
      activePanel = "W";
      selectedBet = null;
      renderBetOptions();
    };

    function checkWords() {
      const text = document.body.innerText;
      const ok = requiredWords.every((w) => text.includes(w));
      wButton.style.display = ok ? "flex" : "none";
      if (!ok) {
        panel.style.display = "none";
        activePanel = null;
      }
    }

    new MutationObserver(checkWords).observe(document.body, { childList: true, subtree: true });
    checkWords();
  })();

  // ===== $ PANEL =====
  (function () {
    let dollarView = "HOME";
    const RATE_KEY = "DOLLAR_RATES";
    const defaultRates = { USDT: 0, TRON: 0, UTOPIA: 0, BEP20: 0 };

    function getRates() {
      return JSON.parse(localStorage.getItem(RATE_KEY)) || { ...defaultRates };
    }

    function setRates(rates) {
      localStorage.setItem(RATE_KEY, JSON.stringify(rates));
    }

    function formatNumber(n) {
      return Number(n || 0).toLocaleString("en-US");
    }

    function createCircleButton({ label, bottom, bg }) {
      const b = document.createElement("div");
      Object.assign(b.style, {
        position: "fixed",
        left: "15px",
        bottom,
        width: "50px",
        height: "50px",
        borderRadius: "50%",
        backgroundColor: bg,
        color: "#000",
        fontWeight: "bold",
        fontSize: "24px",
        display: "none",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        zIndex: "10001",
        userSelect: "none",
      });
      b.innerText = label;
      document.body.appendChild(b);
      return b;
    }

    const dollarButton = createCircleButton({ label: "$", bottom: "75px", bg: "#3a8f3a" });
    const dollarPanel = document.createElement("div");
    window.dollarPanelInstance = dollarPanel;

    Object.assign(dollarPanel.style, {
      position: "fixed",
      left: "75px",
      bottom: "75px",
      width: "220px",
      backgroundColor: "#3a8f3a",
      color: "#000",
      borderRadius: "8px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
      padding: "12px",
      fontSize: "12px",
      display: "none",
      zIndex: "10002",
    });

    document.body.append(dollarPanel);

    function dollarBtnStyle() {
      return {
        width: "100%",
        marginBottom: "8px",
        padding: "8px",
        background: "#2f6f2f",
        color: "#fff",
        border: "none",
        borderRadius: "4px",
        fontWeight: "bold",
        cursor: "pointer",
      };
    }

    function inputStyle() {
      return {
        width: "100%",
        padding: "6px",
        marginBottom: "8px",
        borderRadius: "4px",
        border: "1px solid #ccc",
        fontSize: "14px",
      };
    }

    function backBtn() {
      const b = document.createElement("button");
      b.innerText = "بازگشت";
      Object.assign(b.style, {
        width: "100%",
        padding: "8px",
        background: "#c0392b",
        color: "#fff",
        border: "none",
        borderRadius: "4px",
        fontWeight: "bold",
        cursor: "pointer",
      });
      b.onclick = () => {
        dollarView = "HOME";
        renderDollar();
      };
      dollarPanel.appendChild(b);
    }

    function renderDollarHome() {
      dollarPanel.innerHTML = "";
      ["بروز رسانی قیمت ارز", "استعلام مقدار واریزی"].forEach((t, i) => {
        const b = document.createElement("button");
        b.innerText = t;
        Object.assign(b.style, dollarBtnStyle());
        b.onclick = () => {
          dollarView = i === 0 ? "UPDATE" : "CHECK";
          renderDollar();
        };
        dollarPanel.appendChild(b);
      });
    }

    function renderUpdate() {
      dollarPanel.innerHTML = "";
      const rates = getRates();

      Object.keys(rates).forEach((k) => {
        const l = document.createElement("div");
        l.innerText = k;
        l.style.fontWeight = "bold";
        l.style.marginBottom = "4px";
        dollarPanel.appendChild(l);

        const i = document.createElement("input");
        i.type = "text";
        i.value = formatNumber(rates[k]);
        Object.assign(i.style, inputStyle());

        i.oninput = () => {
          const raw = i.value.replace(/,/g, "").replace(/\D/g, "");
          rates[k] = Number(raw || 0);
          i.value = formatNumber(raw);
        };

        dollarPanel.appendChild(i);
      });

      const save = document.createElement("button");
      save.innerText = "ثبت بروز رسانی";
      Object.assign(save.style, dollarBtnStyle());
      save.onclick = () => {
        setRates(rates);
        alert("قیمت‌ها ذخیره شد");
      };
      dollarPanel.appendChild(save);

      backBtn();
    }

    function renderCheck() {
      dollarPanel.innerHTML = "";
      let rates = getRates();

      const labelStyle = {
        color: "#000",
        fontWeight: "bold",
        fontSize: "15px",
        margin: "8px 0",
      };

      const lbl1 = document.createElement("div");
      lbl1.innerText = "* ارز مورد نظر را انتخاب کنید";
      Object.assign(lbl1.style, labelStyle);
      dollarPanel.appendChild(lbl1);

      const sel = document.createElement("select");
      Object.assign(sel.style, inputStyle());
      Object.keys(rates).forEach((k) => {
        const o = document.createElement("option");
        o.value = k;
        o.innerText = k;
        sel.appendChild(o);
      });
      dollarPanel.appendChild(sel);

      const lbl2 = document.createElement("div");
      lbl2.innerText = "* مقدار ارز واریزی را بنویسید";
      Object.assign(lbl2.style, labelStyle);
      dollarPanel.appendChild(lbl2);

      const inp = document.createElement("input");
      inp.type = "text";
      Object.assign(inp.style, inputStyle());
      dollarPanel.appendChild(inp);

      const res = document.createElement("div");
      Object.assign(res.style, {
        marginTop: "14px",
        marginBottom: "16px",
        fontSize: "16px",
        fontWeight: "bold",
      });
      dollarPanel.appendChild(res);

      function recalc() {
        rates = getRates();
        const amount = Number(inp.value.replace(/,/g, "") || 0);
        const rate = rates[sel.value] || 0;
        res.innerText = amount
          ? `مقدار واریزی کاربر ${formatNumber(amount * rate)} تومان می باشد`
          : "";
      }

      inp.oninput = () => {
        const raw = inp.value.replace(/,/g, "").replace(/\D/g, "");
        inp.value = formatNumber(raw);
        recalc();
      };

      sel.onchange = recalc;

      backBtn();
    }

    function renderDollar() {
      if (dollarView === "HOME") renderDollarHome();
      if (dollarView === "UPDATE") renderUpdate();
      if (dollarView === "CHECK") renderCheck();
    }

    function checkDollarWords() {
      const text = document.body.innerText;
      const requiredWords = ["Amount", "Card", "Saba", "Bank"];
      const ok = requiredWords.every((w) => text.includes(w));
      dollarButton.style.display = ok ? "flex" : "none";
      if (!ok) dollarPanel.style.display = "none";
    }

    new MutationObserver(checkDollarWords).observe(document.body, { childList: true, subtree: true });
    checkDollarWords();

    dollarButton.onclick = () => {
      // بستن پنل W اگر باز است
      if (window.wPanelInstance && window.wPanelInstance.style.display === "block") {
        window.wPanelInstance.style.display = "none";
      }

      if (dollarPanel.style.display === "block") {
        dollarPanel.style.display = "none";
        activePanel = null;
        return;
      }
      dollarPanel.style.display = "block";
      activePanel = "$";
      dollarView = "HOME";
      renderDollar();
    };
  })();
})();
