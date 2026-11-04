/* Cardápio de demonstração. Sem dependências, sem build. */

/* Número que recebe o pedido, no formato 55DDDNUMERO. Troque aqui. */
const WHATSAPP_NUMERO = "5519000000000";

(function () {
  "use strict";

  var NOME_LOJA = "Pizzaria Exemplo";
  var D = window.CARDAPIO;
  var STORAGE_KEY = "cardapio-demo-carrinho";

  /* ---------- utilitários ---------- */
  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }

  var fmt = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
  function brl(v) { return fmt.format(Math.round(v * 100) / 100).replace(/ /g, " "); }

  function el(tag, attrs, children) {
    var n = document.createElement(tag);
    Object.keys(attrs || {}).forEach(function (k) {
      if (k === "class") n.className = attrs[k];
      else if (k === "text") n.textContent = attrs[k];
      else n.setAttribute(k, attrs[k]);
    });
    (children || []).forEach(function (c) { if (c) n.appendChild(c); });
    return n;
  }
  function icone(nome) {
    var s = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    s.setAttribute("class", "ic");
    s.setAttribute("aria-hidden", "true");
    var u = document.createElementNS("http://www.w3.org/2000/svg", "use");
    u.setAttributeNS("http://www.w3.org/1999/xlink", "href", "#i-" + nome);
    u.setAttribute("href", "#i-" + nome);
    s.appendChild(u);
    return s;
  }
  function imagem(item, cls) {
    return el("img", { src: "assets/img/" + item.img + ".webp", width: "800", height: "600", loading: "lazy", alt: item.alt, "class": cls || "" });
  }
  function porId(id) {
    var i, todos = D.ITENS.concat(D.EXTRAS);
    for (i = 0; i < todos.length; i++) if (todos[i].id === id) return todos[i];
    return null;
  }

  /* ---------- carrinho (memória + sessionStorage opcional) ---------- */
  var carrinho = [];
  function salvar() {
    try { sessionStorage.setItem(STORAGE_KEY, JSON.stringify(carrinho)); } catch (e) { /* bloqueado: segue só na memória */ }
  }
  function carregar() {
    try {
      var bruto = sessionStorage.getItem(STORAGE_KEY);
      if (!bruto) return;
      var dados = JSON.parse(bruto);
      if (Array.isArray(dados)) {
        carrinho = dados.filter(function (l) {
          return l && typeof l.key === "string" && typeof l.nome === "string" &&
                 typeof l.preco === "number" && typeof l.qtd === "number" && l.qtd > 0;
        }).slice(0, 50);
      }
    } catch (e) { carrinho = []; }
  }
  function totalCarrinho() { return carrinho.reduce(function (t, l) { return t + l.preco * l.qtd; }, 0); }
  function qtdCarrinho() { return carrinho.reduce(function (t, l) { return t + l.qtd; }, 0); }

  function adicionar(linha) {
    var existente = carrinho.filter(function (l) { return l.key === linha.key; })[0];
    if (existente) existente.qtd += 1;
    else carrinho.push({ key: linha.key, nome: linha.nome, detalhe: linha.detalhe || "", preco: linha.preco, qtd: 1 });
    salvar();
    atualizarBarra();
    renderCarrinho();
  }

  /* ---------- diálogos ---------- */
  function abrir(dlg) {
    if (typeof dlg.showModal === "function") { if (!dlg.open) dlg.showModal(); }
    else dlg.setAttribute("open", "");
  }
  function fechar(dlg) {
    if (typeof dlg.close === "function") dlg.close(); else dlg.removeAttribute("open");
  }
  var dlgSug = $("#dlg-sugestao"), dlgCar = $("#dlg-carrinho"), dlgAc = $("#dlg-acompanhe");
  var ultimoFoco = null;
  [dlgSug, dlgCar, dlgAc].forEach(function (d) {
    d.addEventListener("click", function (e) { if (e.target === d) fechar(d); }); /* toque fora fecha */
    d.addEventListener("close", function () { if (ultimoFoco && document.contains(ultimoFoco)) ultimoFoco.focus(); });
    $$("[data-fechar]", d).forEach(function (b) { b.addEventListener("click", function () { fechar(d); }); });
  });
  function lembrarFoco() { ultimoFoco = document.activeElement; }

  /* ---------- cardápio ---------- */
  var cardapioEl = $("#cardapio");
  var listaCats = $("#cats-lista");

  function precoCombo(item) { return { de: item.valorSeparado, por: item.preco, eco: item.valorSeparado - item.preco }; }

  function montarCard(item) {
    var ehPizza = !!item.precos;
    var ehCombo = item.cat === "combos";
    var idNome = "n-" + item.id;
    var card = el("article", { "class": "card", "aria-labelledby": idNome });

    var media = el("div", { "class": "card-media" }, [imagem(item)]);
    var info = el("div", { "class": "card-info" });
    if (item.selo) info.appendChild(el("p", { "class": "selo", text: item.selo }));
    info.appendChild(el("h3", { id: idNome, text: item.nome }));
    info.appendChild(el("p", { "class": "desc", text: item.desc }));
    if (ehCombo) {
      var ul = el("ul", { "class": "inclui", "aria-label": "O que vem no combo" });
      item.inclui.forEach(function (t) { ul.appendChild(el("li", {}, [icone("check"), el("span", { text: t })])); });
      info.appendChild(ul);
    }

    var foot = el("div", { "class": "card-foot" });
    var preco = el("p", { "class": "preco" + (ehCombo ? " preco-combo" : "") });
    var tamanhoAtual = 1; /* Média por padrão */

    if (ehPizza) {
      var grupo = el("fieldset", { "class": "tamanhos" }, [el("legend", { "class": "sr", text: "Tamanho da " + item.nome })]);
      D.TAMANHOS.forEach(function (t, i) {
        var rid = "t-" + item.id + "-" + i;
        var inp = el("input", { type: "radio", name: "tam-" + item.id, id: rid, value: String(i) });
        if (i === tamanhoAtual) inp.checked = true;
        inp.addEventListener("change", function () { tamanhoAtual = i; pintarPreco(); });
        var lab = el("label", { "for": rid }, [el("span", { "class": "t-nome", text: t }), el("span", { "class": "t-preco", text: brl(item.precos[i]) })]);
        grupo.appendChild(inp); grupo.appendChild(lab);
      });
      foot.appendChild(grupo);
    }

    function pintarPreco() {
      preco.textContent = "";
      if (ehPizza) {
        preco.appendChild(el("strong", { text: brl(item.precos[tamanhoAtual]) }));
      } else if (ehCombo) {
        var c = precoCombo(item);
        preco.appendChild(el("span", { "class": "de", text: "De " + brl(c.de) }));
        preco.appendChild(el("strong", { text: brl(c.por) }));
        preco.appendChild(el("span", { "class": "eco", text: "Economize " + brl(c.eco) }));
      } else {
        preco.appendChild(el("strong", { text: brl(item.preco) }));
      }
    }
    pintarPreco();

    var btn = el("button", { type: "button", "class": "btn btn-prim", "aria-label": "Adicionar " + item.nome + " ao pedido" }, [icone("plus"), el("span", { text: "Adicionar" })]);
    btn.addEventListener("click", function () {
      lembrarFoco();
      var linha;
      if (ehPizza) {
        linha = { key: item.id + ":" + tamanhoAtual, nome: item.nome, detalhe: D.TAMANHOS[tamanhoAtual], preco: item.precos[tamanhoAtual] };
      } else {
        linha = { key: item.id, nome: item.nome, detalhe: "", preco: item.preco };
      }
      adicionar(linha);
      mostrarSugestoes(item, linha);
    });

    var linhaFim = el("div", { "class": "foot-fim" }, [preco, btn]);
    foot.appendChild(linhaFim);

    card.appendChild(info);
    card.appendChild(media);
    card.appendChild(foot);
    return card;
  }

  function montarMenu() {
    D.CATEGORIAS.forEach(function (c) {
      var secId = "cat-" + c.id;
      var a = el("a", { href: "#" + secId, "data-cat": c.id, "class": "cat-link" }, [icone(c.icone), el("span", { text: c.nome })]);
      listaCats.appendChild(el("li", {}, [a]));

      var sec = el("section", { id: secId, "class": "secao", "aria-labelledby": "h-" + c.id });
      sec.appendChild(el("h2", { id: "h-" + c.id }, [icone(c.icone), el("span", { text: c.nome })]));
      var grade = el("div", { "class": "grade" });
      D.ITENS.filter(function (i) { return i.cat === c.id; }).forEach(function (i) { grade.appendChild(montarCard(i)); });
      sec.appendChild(grade);
      cardapioEl.appendChild(sec);
    });
  }

  /* ---------- categorias: clique e rolagem ---------- */
  var reduzMovimento = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var catsNav = $("#cats");

  listaCats.addEventListener("click", function (e) {
    var a = e.target.closest("a[data-cat]");
    if (!a) return;
    e.preventDefault();
    var sec = document.getElementById("cat-" + a.getAttribute("data-cat"));
    if (sec) sec.scrollIntoView({ behavior: reduzMovimento ? "auto" : "smooth", block: "start" });
    ativar(a.getAttribute("data-cat"));
    travaSpy = Date.now() + 700;
    setTimeout(spy, 900);
  });

  var travaSpy = 0, ativa = "";
  function ativar(id) {
    if (id === ativa) return;
    ativa = id;
    $$(".cat-link", listaCats).forEach(function (a) {
      var on = a.getAttribute("data-cat") === id;
      if (on) a.setAttribute("aria-current", "true"); else a.removeAttribute("aria-current");
      if (on) {
        var alvo = a.offsetLeft - (catsNav.clientWidth - a.offsetWidth) / 2;
        catsNav.scrollTo({ left: alvo, behavior: reduzMovimento ? "auto" : "smooth" });
      }
    });
  }
  function spy() {
    if (Date.now() < travaSpy) return;
    var linha = catsNav.getBoundingClientRect().bottom + 24;
    var atual = D.CATEGORIAS[0].id;
    D.CATEGORIAS.forEach(function (c) {
      var s = document.getElementById("cat-" + c.id);
      if (s && s.getBoundingClientRect().top <= linha) atual = c.id;
    });
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) atual = D.CATEGORIAS[D.CATEGORIAS.length - 1].id;
    ativar(atual);
  }
  var pendente = false, fimRolagem = 0;
  window.addEventListener("scroll", function () {
    if (pendente) return;
    pendente = true;
    requestAnimationFrame(function () { pendente = false; spy(); });
    clearTimeout(fimRolagem);
    fimRolagem = setTimeout(spy, 150);
  }, { passive: true });

  /* ---------- sugestões ---------- */
  var sugLista = $("#sug-lista"), sugNao = $("#sug-nao");
  function mostrarSugestoes(item, linha) {
    $("#sug-adicionado").textContent = linha.nome + (linha.detalhe ? " (" + linha.detalhe + ")" : "") + " adicionado";
    sugLista.textContent = "";
    var jaTem = {};
    var sugs = D.EXTRAS.filter(function (x) { return x.id !== item.id && x.para.indexOf(item.cat) !== -1; }).slice(0, 3);
    sugs.forEach(function (x) {
      var btn = el("button", { type: "button", "class": "btn btn-sec btn-peq", "aria-label": "Adicionar " + x.nome + " por " + brl(x.preco) }, [icone("plus"), el("span", { text: "Adicionar" })]);
      btn.addEventListener("click", function () {
        adicionar({ key: x.id, nome: x.nome, detalhe: "", preco: x.preco });
        btn.disabled = true;
        btn.textContent = "";
        btn.appendChild(icone("check"));
        btn.appendChild(el("span", { text: "Adicionado" }));
        btn.setAttribute("aria-label", x.nome + " adicionado");
        sugNao.textContent = "Continuar";
        jaTem[x.id] = true;
      });
      var li = el("li", { "class": "sug" }, [
        imagem(x, "sug-img"),
        el("div", { "class": "sug-txt" }, [el("strong", { text: x.nome }), el("span", { text: x.desc }), el("span", { "class": "sug-preco", text: "+ " + brl(x.preco) })]),
        btn
      ]);
      sugLista.appendChild(li);
    });
    sugNao.textContent = "Não, obrigado";
    abrir(dlgSug);
  }
  $("#sug-nao").addEventListener("click", function () { fechar(dlgSug); });
  $("#sug-carrinho").addEventListener("click", function () { fechar(dlgSug); abrirCarrinho(); });

  /* ---------- barra e tela do carrinho ---------- */
  var barra = $("#barra-carrinho");
  function atualizarBarra() {
    var q = qtdCarrinho();
    $("#bc-texto").textContent = q === 0 ? "Carrinho" : q + (q === 1 ? " item" : " itens");
    $("#bc-total").textContent = q === 0 ? "" : brl(totalCarrinho());
    barra.classList.toggle("tem", q > 0);
    barra.setAttribute("aria-label", q === 0 ? "Abrir carrinho, vazio" : "Abrir carrinho, " + q + (q === 1 ? " item, total " : " itens, total ") + brl(totalCarrinho()));
  }

  var carItens = $("#car-itens"), carForm = $("#car-form"), carVazio = $("#car-vazio");
  function renderCarrinho() {
    var vazio = carrinho.length === 0;
    carVazio.hidden = !vazio;
    carForm.hidden = vazio;
    carItens.textContent = "";
    carrinho.forEach(function (l, idx) {
      var nome = l.nome + (l.detalhe ? " (" + l.detalhe + ")" : "");
      var menos = el("button", { type: "button", "class": "icone-btn", "aria-label": "Diminuir quantidade de " + nome }, [icone("minus")]);
      var mais = el("button", { type: "button", "class": "icone-btn", "aria-label": "Aumentar quantidade de " + nome }, [icone("plus")]);
      var rem = el("button", { type: "button", "class": "icone-btn rem", "aria-label": "Remover " + nome }, [icone("trash")]);
      menos.addEventListener("click", function () { mudarQtd(l.key, -1); });
      mais.addEventListener("click", function () { mudarQtd(l.key, 1); });
      rem.addEventListener("click", function () { remover(l.key); });
      carItens.appendChild(el("li", { "class": "car-item" }, [
        el("div", { "class": "ci-txt" }, [el("strong", { text: nome }), el("span", { text: brl(l.preco) + " cada" })]),
        el("div", { "class": "ci-qtd" }, [menos, el("output", { text: String(l.qtd), "aria-label": "Quantidade" }), mais]),
        el("p", { "class": "ci-sub", text: brl(l.preco * l.qtd) }),
        rem
      ]));
    });
    $("#car-total").textContent = brl(totalCarrinho());
  }
  function mudarQtd(key, d) {
    var l = carrinho.filter(function (x) { return x.key === key; })[0];
    if (!l) return;
    l.qtd += d;
    if (l.qtd <= 0) carrinho = carrinho.filter(function (x) { return x.key !== key; });
    depoisDeMudar();
  }
  function remover(key) { carrinho = carrinho.filter(function (x) { return x.key !== key; }); depoisDeMudar(); }
  function depoisDeMudar() {
    salvar(); atualizarBarra(); renderCarrinho();
    if (carrinho.length === 0) { var b = $("[data-fechar]", carVazio); if (b) b.focus(); }
  }
  function abrirCarrinho() { renderCarrinho(); abrir(dlgCar); }
  barra.addEventListener("click", function () { lembrarFoco(); abrirCarrinho(); });
  $("#abrir-acompanhe").addEventListener("click", function () { lembrarFoco(); abrir(dlgAc); });

  /* ---------- envio por WhatsApp ---------- */
  function montarMensagem(dados) {
    var linhas = [];
    linhas.push("*Novo pedido · " + NOME_LOJA + "*");
    linhas.push("");
    linhas.push("*Itens*");
    carrinho.forEach(function (l) {
      linhas.push(l.qtd + "x " + l.nome + (l.detalhe ? " (" + l.detalhe + ")" : "") + " · " + brl(l.preco * l.qtd));
    });
    linhas.push("");
    linhas.push("*Total:* " + brl(totalCarrinho()));
    linhas.push("");
    linhas.push("*Nome:* " + dados.nome);
    linhas.push("*Endereço:* " + dados.end);
    linhas.push("*Pagamento:* " + dados.pag);
    if (dados.obs) linhas.push("*Observação:* " + dados.obs);
    linhas.push("");
    linhas.push("(Pedido de demonstração)");
    return linhas.join("\n");
  }
  function urlWhats(mensagem) {
    return "https://wa.me/" + WHATSAPP_NUMERO + "?text=" + encodeURIComponent(mensagem);
  }
  window.__cardapio = { montarMensagem: montarMensagem, urlWhats: urlWhats }; /* ajuda nos testes */

  carForm.addEventListener("submit", function (e) {
    e.preventDefault();
    if (carrinho.length === 0) return;
    var nome = $("#f-nome"), end = $("#f-end");
    var okNome = nome.value.trim() !== "", okEnd = end.value.trim() !== "";
    $("#erro-nome").hidden = okNome; $("#erro-end").hidden = okEnd;
    nome.setAttribute("aria-invalid", String(!okNome)); end.setAttribute("aria-invalid", String(!okEnd));
    if (!okNome) { nome.focus(); return; }
    if (!okEnd) { end.focus(); return; }
    var msg = montarMensagem({
      nome: nome.value.trim(), end: end.value.trim(),
      pag: $("#f-pag").value, obs: $("#f-obs").value.trim().replace(/\s*\n\s*/g, " ")
    });
    window.open(urlWhats(msg), "_blank", "noopener");
  });
  ["f-nome", "f-end"].forEach(function (id) {
    $("#" + id).addEventListener("input", function () {
      if (this.value.trim() !== "") { this.setAttribute("aria-invalid", "false"); $("#erro-" + (id === "f-nome" ? "nome" : "end")).hidden = true; }
    });
  });

  /* ---------- banner de destaque ---------- */
  var combo = porId("combo-familia");
  (function () {
    var c = precoCombo(combo);
    $("#hero-de").textContent = "De " + brl(c.de);
    $("#hero-por").textContent = brl(c.por);
    $("#hero-eco").textContent = "Economize " + brl(c.eco);
    $("#hero-pedir").addEventListener("click", function () {
      lembrarFoco();
      var linha = { key: combo.id, nome: combo.nome, detalhe: "", preco: combo.preco };
      adicionar(linha); mostrarSugestoes(combo, linha);
    });
  })();

  /* ---------- início ---------- */
  carregar();
  montarMenu();
  atualizarBarra();
  renderCarrinho();
  spy();
})();
