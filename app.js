// ===== Dados =====
const produtos = [
  { id: 1, nome: "Camiseta Champion", preco: 110, descricao: "Camiseta da AAAP em parceria com a Champion", img: "./assets/imgs/champions.jpeg" },
  { id: 2, nome: "Caneca de dia das mães", preco: 35, descricao: "Presente ideal para a sua querida mãe", img: "./assets/imgs/mae.jpeg" },
  { id: 3, nome: "Jaqueta Poli USP", preco: 90, descricao: "Jaqueta personalizada", img: "./assets/imgs/jaco.jpeg" },
  { id: 4, nome: "Camiseta Interusp 2025", preco: 70, descricao: "Camiseta 100% algodão que representa a Poli USP", img: "./assets/imgs/iusp2025.jpeg" },
  { id: 5, nome: "Shorts para o IUSP", preco: 80, descricao: "Shorts exclusivos para o Interusp 2025", img: "./assets/imgs/shorts.iusp.jpeg" },
  { id: 6, nome: "Bandana", preco: 25, descricao: "Bandana – edição especial Interusp", img: "./assets/imgs/bandana.jpeg" },
  { id: 7, nome: "Caneca Poli USP", preco: 40, descricao: "A caneca perfeita para seu open", img: "./assets/imgs/caneca.jpeg" },
  { id: 8, nome: "Boné - Poli USP", preco: 35, descricao: "Boné branco – Poli USP", img: "./assets/imgs/bone.jpeg" },
  { id: 9, nome: "Kit Bixo 2025", preco: 120, descricao: "Kit composto por sacochila, estojo, régua, caneca e camiseta", img: "./assets/imgs/kitbixo.jpeg" },
];

// ===== Carrinho com Map =====
const carrinho = new Map();

// ===== Formatação BRL (usa toLocaleString; com fallback) =====
function emReais(n) {
  try {
    return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  } catch {
    // fallback simples caso toLocaleString esteja indisponível
    const s = (Math.round(n * 100) / 100).toFixed(2); // "110.00"
    const [intPart, decPart] = s.split(".");
    let out = "", k = 0;
    for (let i = intPart.length - 1; i >= 0; i--) {
      out = intPart[i] + out; k++;
      if (k === 3 && i > 0) { out = "." + out; k = 0; }
    }
    return "R$ " + out + "," + decPart;
  }
}

// ===== Utilitários de compatibilidade =====
const closest = (el, sel) => el.closest ? el.closest(sel) : (function c(e){
  while (e && e !== document) {
    if (sel[0] === "." && e.classList && e.classList.contains(sel.slice(1))) return e;
    e = e.parentNode;
  }
  return null;
})(el);

const getDataId = (el) => (el.dataset && el.dataset.id != null)
  ? Number(el.dataset.id)
  : Number(el.getAttribute("data-id"));

// ===== DOM =====
const lista     = document.getElementById("products");
const contador  = document.getElementById("cart-count");

// ===== Atualiza contador =====
function atualizarContador() {
  let total = 0;
  for (const q of carrinho.values()) total += q;
  contador.textContent = total;
}

// ===== Cartão de produto =====
function criarCartao(produto) {
  const el = document.createElement("article");
  el.className = "card";
  el.innerHTML = `
    <img src="${produto.img}" alt="${produto.nome}">
    <div class="body">
      <div class="title">
        ${produto.nome} - <span class="price">${emReais(produto.preco)}</span>
      </div>
      <div class="desc">${produto.descricao}</div>
      <div class="actions">
        <button class="btn btn-rem" data-id="${produto.id}">−</button>
        <button class="btn btn-add" data-id="${produto.id}">Adicionar ao Carrinho</button>
      </div>
    </div>
  `;
  return el;
}

// ===== Renderizar =====
function renderizar() {
  lista.innerHTML = "";
  produtos.slice(0, 9).forEach(p => lista.appendChild(criarCartao(p)));
}
renderizar();

// ===== Eventos =====
lista.addEventListener("click", (e) => {
  const btnAdd = closest(e.target, ".btn-add");
  const btnRem = closest(e.target, ".btn-rem");
  if (!btnAdd && !btnRem) return;

  const btn = btnAdd || btnRem;
  const id = getDataId(btn);
  const atual = carrinho.get(id) ?? 0;

  if (btnAdd) carrinho.set(id, atual + 1);
  if (btnRem) carrinho.set(id, Math.max(0, atual - 1));

  atualizarContador();
});

atualizarContador();
