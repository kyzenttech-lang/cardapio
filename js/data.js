/* Dados de exemplo do cardápio. Nomes, preços e imagens são fictícios. */
(function () {
  "use strict";

  var CATEGORIAS = [
    { id: "combos", nome: "Combos", icone: "combo" },
    { id: "pizzas", nome: "Pizzas", icone: "pizza" },
    { id: "lanches", nome: "Lanches", icone: "lanche" },
    { id: "porcoes", nome: "Porções", icone: "porcao" },
    { id: "bebidas", nome: "Bebidas", icone: "bebida" },
    { id: "sobremesas", nome: "Sobremesas", icone: "sobremesa" }
  ];

  var TAMANHOS = ["Broto", "Média", "Grande"];

  /* alt = texto alternativo da imagem; selo = "Mais pedido" | "Novo" */
  var ITENS = [
    /* Combos: "inclui" mostra o que vem dentro; "valorSeparado" é a soma dos itens avulsos. */
    { id: "combo-familia", cat: "combos", nome: "Combo Família", desc: "Para a mesa cheia: duas pizzas grandes, refrigerante de 2 litros e sobremesa.",
      preco: 139.9, valorSeparado: 159.6, inclui: ["2 pizzas grandes", "Refrigerante 2 L", "Brownie com sorvete"],
      img: "combo-familia", alt: "Colagem com duas pizzas, um copo de refrigerante e um brownie com sorvete", selo: "Mais pedido" },
    { id: "combo-casal", cat: "combos", nome: "Combo Casal", desc: "Uma pizza média, duas latas e uma sobremesa para dividir.",
      preco: 64.9, valorSeparado: 74.8, inclui: ["1 pizza média", "2 refrigerantes lata", "Brownie com sorvete"],
      img: "combo-casal", alt: "Colagem com pizza de mussarela, refrigerante e brownie com sorvete", selo: "" },
    { id: "combo-lanche", cat: "combos", nome: "Combo Lanche Duplo", desc: "Dois lanches, uma porção de batata e refrigerante de 2 litros.",
      preco: 69.9, valorSeparado: 83.6, inclui: ["2 lanches X-Burger", "Batata frita", "Refrigerante 2 L"],
      img: "combo-lanche", alt: "Colagem com hambúrguer, batata frita e refrigerante", selo: "Novo" },
    { id: "combo-individual", cat: "combos", nome: "Combo Individual", desc: "Pizza broto, refrigerante lata e uma taça de sorvete.",
      preco: 42.9, valorSeparado: 51.3, inclui: ["1 pizza broto", "Refrigerante lata", "Taça de sorvete"],
      img: "combo-individual", alt: "Colagem com pizza, refrigerante gelado e taça de sorvete", selo: "" },

    /* Pizzas: preço por tamanho */
    { id: "pizza-calabresa", cat: "pizzas", nome: "Pizza Calabresa", desc: "Molho de tomate, mussarela, calabresa fatiada e cebola.",
      precos: [29.9, 49.9, 64.9], img: "pizza-calabresa", alt: "Pizza de calabresa com queijo derretido", selo: "Mais pedido" },
    { id: "pizza-mussarela", cat: "pizzas", nome: "Pizza Mussarela", desc: "Molho de tomate, mussarela, tomate fatiado e manjericão.",
      precos: [26.9, 44.9, 58.9], img: "pizza-mussarela", alt: "Pizza de mussarela com molho de tomate e manjericão", selo: "" },
    { id: "pizza-frango", cat: "pizzas", nome: "Pizza Frango com Requeijão", desc: "Frango desfiado temperado, requeijão cremoso e milho.",
      precos: [31.9, 52.9, 68.9], img: "pizza-frango", alt: "Pizza de frango desfiado com ervas", selo: "" },
    { id: "pizza-queijos", cat: "pizzas", nome: "Pizza Quatro Queijos", desc: "Mussarela, provolone, parmesão e queijo cremoso.",
      precos: [33.9, 55.9, 72.9], img: "pizza-queijos", alt: "Pizza de queijos com borda dourada", selo: "Novo" },

    { id: "lanche-xburger", cat: "lanches", nome: "X-Burger", desc: "Pão macio, hambúrguer de 120 g, queijo, alface e tomate.",
      preco: 22.9, img: "lanche-xburger", alt: "Hambúrguer com queijo, alface e pão de gergelim", selo: "Mais pedido" },
    { id: "lanche-xbacon", cat: "lanches", nome: "X-Bacon", desc: "Hambúrguer, bacon crocante, queijo derretido e molho da casa.",
      preco: 27.9, img: "lanche-xbacon", alt: "Hambúrguer com queijo cheddar e bacon", selo: "" },
    { id: "lanche-xfrango", cat: "lanches", nome: "X-Frango", desc: "Filé de frango empanado, queijo, alface e maionese.",
      preco: 24.9, img: "lanche-xfrango", alt: "Sanduíche de frango empanado com tomate", selo: "" },
    { id: "lanche-hotdog", cat: "lanches", nome: "Cachorro-quente Completo", desc: "Duas salsichas, purê, batata palha, milho e molhos.",
      preco: 18.9, img: "lanche-hotdog", alt: "Cachorro-quente com picles e cebola", selo: "Novo" },

    { id: "porcao-batata", cat: "porcoes", nome: "Batata Frita", desc: "Porção crocante para 2 pessoas, com sal na medida.",
      preco: 24.9, img: "porcao-batata", alt: "Prato de batatas fritas com salsinha", selo: "Mais pedido" },
    { id: "porcao-cebola", cat: "porcoes", nome: "Anéis de Cebola", desc: "Empanados e sequinhos, com molho para mergulhar.",
      preco: 26.9, img: "porcao-cebola", alt: "Anéis de cebola empanados em uma tigela", selo: "" },
    { id: "porcao-calabresa", cat: "porcoes", nome: "Calabresa Acebolada", desc: "Calabresa fatiada na chapa com cebola dourada.",
      preco: 32.9, img: "porcao-calabresa", alt: "Prato de linguiça fatiada com cebola", selo: "" },
    { id: "porcao-mandioca", cat: "porcoes", nome: "Mandioca Frita", desc: "Macia por dentro, dourada por fora.",
      preco: 22.9, img: "porcao-mandioca", alt: "Mandioca frita em pedaços sobre papel", selo: "" },

    { id: "bebida-refri2l", cat: "bebidas", nome: "Refrigerante 2 L", desc: "Garrafa de 2 litros, bem gelada.",
      preco: 12.9, img: "bebida-refri2l", alt: "Copo de refrigerante de cola com gelo e limão", selo: "" },
    { id: "bebida-lata", cat: "bebidas", nome: "Refrigerante Lata", desc: "Lata de 350 ml. Pergunte pelos sabores.",
      preco: 6.5, img: "bebida-lata", alt: "Copo de refrigerante de cola com gelo", selo: "Mais pedido" },
    { id: "bebida-suco", cat: "bebidas", nome: "Suco de Laranja", desc: "Natural, feito na hora, 400 ml.",
      preco: 9.9, img: "bebida-suco", alt: "Copo de suco de laranja sendo servido", selo: "Novo" },
    { id: "bebida-agua", cat: "bebidas", nome: "Água Mineral", desc: "Garrafa de 500 ml, sem gás.",
      preco: 4.0, img: "bebida-agua", alt: "Garrafa de água mineral sem rótulo", selo: "" },

    { id: "sobremesa-brownie", cat: "sobremesas", nome: "Brownie com Sorvete", desc: "Brownie de chocolate quentinho com bola de creme.",
      preco: 16.9, img: "sobremesa-brownie", alt: "Brownie de chocolate com sorvete de creme", selo: "Mais pedido" },
    { id: "sobremesa-pudim", cat: "sobremesas", nome: "Pudim de Leite", desc: "Fatia generosa com calda de caramelo.",
      preco: 11.9, img: "sobremesa-pudim", alt: "Pudim de leite com calda de caramelo no prato", selo: "" },
    { id: "sobremesa-pizzadoce", cat: "sobremesas", nome: "Pizza Doce de Chocolate", desc: "Broto com chocolate, granulado e morangos.",
      preco: 27.9, img: "sobremesa-pizzadoce", alt: "Pizza doce de chocolate com sorvete", selo: "Novo" },
    { id: "sobremesa-sorvete", cat: "sobremesas", nome: "Taça de Sorvete", desc: "Três bolas com calda de chocolate e cereja.",
      preco: 14.9, img: "sobremesa-sorvete", alt: "Taça de sorvete com morangos e casquinha crocante", selo: "" }
  ];

  /* Sugestões do "Quer adicionar?". "para" lista as categorias do item adicionado
     em que a sugestão faz sentido. */
  var EXTRAS = [
    { id: "extra-borda", nome: "Borda recheada", desc: "Recheio de requeijão cremoso", preco: 8.0, img: "extra-borda", alt: "Fatia de pizza com borda recheada de queijo", para: ["pizzas", "combos"] },
    { id: "bebida-lata", nome: "Refrigerante Lata", desc: "350 ml, bem gelada", preco: 6.5, img: "bebida-lata", alt: "Copo de refrigerante de cola com gelo", para: ["pizzas", "lanches", "porcoes", "sobremesas"] },
    { id: "bebida-suco", nome: "Suco de Laranja", desc: "Natural, 400 ml", preco: 9.9, img: "bebida-suco", alt: "Copo de suco de laranja sendo servido", para: ["lanches", "porcoes", "pizzas"] },
    { id: "porcao-batata", nome: "Batata Frita", desc: "Porção para 2 pessoas", preco: 24.9, img: "porcao-batata", alt: "Prato de batatas fritas com salsinha", para: ["lanches"] },
    { id: "sobremesa-brownie", nome: "Brownie com Sorvete", desc: "Quentinho, com bola de creme", preco: 16.9, img: "sobremesa-brownie", alt: "Brownie de chocolate com sorvete de creme", para: ["pizzas", "lanches", "porcoes", "combos", "bebidas"] },
    { id: "sobremesa-pudim", nome: "Pudim de Leite", desc: "Fatia com calda de caramelo", preco: 11.9, img: "sobremesa-pudim", alt: "Pudim de leite com calda de caramelo no prato", para: ["bebidas", "porcoes"] }
  ];

  window.CARDAPIO = { CATEGORIAS: CATEGORIAS, TAMANHOS: TAMANHOS, ITENS: ITENS, EXTRAS: EXTRAS };
})();
