// as variáveis de "saída"
var canvas;
var context;

// as variáveis do jogo
var state = 0; // estado do jogo
var TILESIZE; // tamanho dos "tiles", apenas para desenhar na tela
var pieces; // a cobra
var apple; // a maçã
var keyUp, keyRight, keyDown, keyLeft; // teclas pressionadas ou soltas
var UP, DOWN, LEFT, RIGHT; // direção da cobra
var velX, velY; // velocidade nos eixos
var collision; // indica colisão da cabeça com alguma parte da cobra
var mapWidth, mapHeight; // dimensão do "mapa"

// as imagens
var imgApple;
var imgPiece;
var imgHead;


function loadImage ( imgUrl )
{
	var img = new Image();
	img.src = imgUrl;
	return img;
}

function Piece ( x, y, dir )
{
	this.id = -1;
	this.x = x || 0;
	this.y = y || 0;
	this.dir = dir || 0;
}

Piece.prototype = 
{
	setPos: function (x, y)
	{
		this.x = x;
		this.y = y;
	},

	randomPos: function (  )
	{
		var repeat;
		var newPos = {x:0, y:0};

		do
		{
			repeat = false;
			newPos.x = Math.floor(Math.random() * mapWidth);
			newPos.y = Math.floor(Math.random() * mapHeight);
			for (var i = 0; i < pieces.length; i++)
				if (pieces[i].id == this.id || (pieces[i].x == newPos.x && pieces[i].y == newPos.y))
					repeat = true;
		} while (repeat);

		this.x = newPos.x;
		this.y = newPos.y;
	},

	draw: function ( img )
	{
		context.drawImage(img, this.x * TILESIZE, this.y * TILESIZE);
	}
}

function keyboardDown ( event )
{
	var ev = event || window.event;

	switch (ev.keyCode)
	{
		case 37: // seta esquerda
			keyLeft = true;
			break;
		case 38: // seta para cima
			keyUp = true;
			break;
		case 39: // seta direita
			keyRight = true;
			break;
		case 40: // seta para baixo
			keyDown = true;
			break;
		case 80: // tecla p = pause game
			velX = velY = 0;
			break;
		default:
			break;
	}
}

function keyboardUp ( event )
{
	var ev = event || window.event;

	switch (ev.keyCode)
	{
		case 37: // seta esquerda
			keyLeft = false;
			break;
		case 38: // seta para cima
			keyUp = false;
			break;
		case 39: // seta direita
			keyRight = false;
			break;
		case 40: // seta para baixo
			keyDown = false;
			break;
		default:
			break;
	}
}

function gameInit (  )
{
	TILESIZE = 32;
	mapWidth = 20;
	mapHeight = 15;
	canvas = document.getElementById("canvas");
	context = canvas.getContext("2d");
	canvas.width = mapWidth * TILESIZE;
	canvas.height = mapHeight * TILESIZE;

	imgPiece = loadImage("img/piece.png");
	imgApple = loadImage("img/apple.png");
	imgHead = loadImage("img/head.png");
	pieces = new Array(new Piece(), new Piece(), new Piece());
	apple = new Piece();
	apple.id = -10;
	velX = velY = 0;
	collision = false;
	// direções a seguir
	UP = 0;
	RIGHT = 1;
	DOWN = 2;
	LEFT = 3;

	// inicializando a parte A - a cabeça
	pieces[2].id = 2;
	pieces[2].x = 3;
	pieces[2].y = 3;
	pieces[2].dir = RIGHT;

	// inicializando a parte B
	pieces[1].id = 1;
	pieces[1].x = 2;
	pieces[1].y = 3;
	pieces[1].dir = RIGHT;

	// inicializando a parte C - o rabo
	pieces[0].id = 0;
	pieces[0].x = 1;
	pieces[0].y = 3;
	pieces[0].dir = RIGHT;

	// escolhe as coordenadas da maçã
	apple.randomPos();

	// por fim seta o estado para 1
	state = 1;
	
	// atualiza o tamnho atual na pagina html
	document.getElementById("currSize").innerHTML = pieces.length;
	// atualiza o tamanho anterior na pagina html
	document.getElementById("lastSize").innerHTML = 0;
}

function gameReset (  )
{
	// atualiza o tamanho anterior na pagina html
	document.getElementById("lastSize").innerHTML = pieces.length;

	// retira o excesso de elementos deixa só 3 pra reiniciar
	while (pieces.length > 3)
		pieces.pop();

	velX = velY = 0;
	collision = false;

	// reinicializando as peças
	// inicializando a parte A - a cabeça
	pieces[2].id = 2;
	pieces[2].x = 3;
	pieces[2].y = 3;
	pieces[2].dir = RIGHT;

	// inicializando a parte B
	pieces[1].id = 1;
	pieces[1].x = 2;
	pieces[1].y = 3;
	pieces[1].dir = RIGHT;

	// inicializando a parte C - o rabo
	pieces[0].id = 0;
	pieces[0].x = 1;
	pieces[0].y = 3;
	pieces[0].dir = RIGHT;

	apple.randomPos();
	// atualiza o tamnho atual na pagina html
	document.getElementById("currSize").innerHTML = pieces.length;
}

function gameLoop (  )
{
	if (keyLeft)
	{
		if (pieces[pieces.length - 1].dir != RIGHT)
		{
			velX = -1;
			velY = 0;
			pieces[pieces.length - 1].dir = LEFT;
		}
	}
	else if (keyUp)
	{
		if (pieces[pieces.length - 1].dir != DOWN)
		{
			velX = 0;
			velY = -1;
			pieces[pieces.length - 1].dir = UP;
		}
	}
	else if (keyRight)
	{
		if (pieces[pieces.length - 1].dir != LEFT)
		{
			velX = 1;
			velY = 0;
			pieces[pieces.length - 1].dir = RIGHT;
		}
	}
	else if (keyDown)
	{
		if (pieces[pieces.length - 1].dir != UP)
		{
			velX = 0;
			velY = 1;
			pieces[pieces.length - 1].dir = DOWN;
		}
	}

	// atualiza as posições das pieces se estiver movendo
	if (velX != 0 || velY != 0)
	{
		for (var i=0; i < pieces.length - 1; i++)
		{
			pieces[i].x = pieces[i + 1].x;
			pieces[i].y = pieces[i + 1].y;
			pieces[i].dir = pieces[i + 1].dir;
		}
	}

	if (pieces[pieces.length - 1].x == apple.x && pieces[pieces.length - 1].y == apple.y)
	{
		pieces.push(new Piece());
		pieces[pieces.length - 1].x = apple.x;
		pieces[pieces.length - 1].y = apple.y;
		pieces[pieces.length - 1].dir = pieces[pieces.length - 2].dir;
		pieces[pieces.length - 1].id = pieces.length - 1;
		apple.randomPos();
		
		// atualiza o tamanho atual na pagina html
		document.getElementById("currSize").innerHTML = pieces.length;
	}

	// agora move a cabeça
	pieces[pieces.length - 1].x += velX;
	pieces[pieces.length - 1].y += velY;

	// depois de mover a cabeça limita o movimento no canvas
	// Para o eixo X
	if (pieces[pieces.length - 1].x >= mapWidth)
	{
		pieces[pieces.length - 1].x = 0;
	}
	else if (pieces[pieces.length - 1].x < 0)
	{
		pieces[pieces.length - 1].x = mapWidth - 1;
	}
	
	// Para o eixo Y
	if (pieces[pieces.length - 1].y >= mapHeight)
	{
		pieces[pieces.length - 1].y = 0;
	}
	else if (pieces[pieces.length - 1].y < 0)
	{
		pieces[pieces.length - 1].y = mapHeight - 1;
	}

	// se colidiu com alguma parte da cobra
	if (collision)
	{
		gameReset();
	}

	// verifica se colidiu com alguma parte da cobra
	for (var i=0; i < pieces.length - 2 && !collision; i++)
		if (pieces[pieces.length - 1].x == pieces[i].x && pieces[pieces.length - 1].y == pieces[i].y)
			collision = true;

	context.fillStyle = "#FFFFFF";
	context.fillRect(0,0,canvas.width,canvas.height);
	
	// desenha o corpo da cobra (sem a cabeça)
	for (var i=0; i < pieces.length - 1; i++)
		pieces[i].draw(imgPiece);
	// desenha a maçã
	apple.draw(imgApple);
	// desenha a cabeça
	pieces[pieces.length - 1].draw(imgHead);
}

function gameMain (  )
{
	switch (state)
	{
		case 0:
			gameInit();
			break;
		case 1:
			gameLoop();
			break;
		default:
			state = 0;
			break;
	}
}

