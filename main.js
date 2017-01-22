var slider_iterations;

var button_hide,
	button_render,
	button_reset;

var label_iterations,
	label_perf;
	
var div_inputs,
	div_area;

var hide = false;

var maxIterations = 100,
	minX_ = -2.5,
	maxX_ = 1,
	minY_ = -1,
	maxY_ = 1,
	minX = minX_,
	maxX = maxX_,
	minY = minY_,
	maxY = maxY_,
	colors = [],
	doRender = false;
	
var mouseX_,
	mouseY_,
	mouseXi,
	mouseYi,
	mouseXf,
	mouseYf;


function setup()
{	
	createCanvas(window.innerWidth, window.innerHeight);
	frameRate(60);
	
	slider_iterations = createSlider(1, 2000, 100, 1);
	slider_iterations.position(10, 10);
	
	slider_iterations.input(readInputs);

	
	label_iterations = createSpan('Max iterations: 100');
	label_iterations.position(150, 10);
	
	button_render = createButton('Render');
	button_render.position(10, 40);
	button_render.mousePressed(function(){doRender = true; loop();});
	
	button_hide = createButton('Hide UI (click this area to show again)');
	button_hide.position(10, 70);
	button_hide.mousePressed(hideUI);
	
	button_reset = createButton('Reset');
	button_reset.position(10, 100);
	button_reset.mousePressed(reset);
	
	label_perf = createSpan('Generated in #ms');
	label_perf.position(10, 130);
	
	div_inputs = createDiv('');
	div_area = createDiv('');
	
	div_area.style('width', '0');
	div_area.style('height', '0');
	div_area.style('background-color', 'rgba(0, 0, 0, 0.5)');
	div_area.style('visibility', 'hidden');
	
	readInputs();
}

function mouseDragged()
{	
	mouseX_ = mouseX;
	mouseY_ = mouseY;
	
	var xDiff = (mouseX - mouseXi);
	var yDiff = (mouseY - mouseYi);
	
	if ( xDiff > 0 )
	{
		div_area.style('left', ''+mouseXi);
		div_area.style('width', ''+xDiff);
	}
	else
	{
		div_area.style('left', ''+mouseX);
		div_area.style('width', ''+(mouseXi - mouseX));
	}
	
	if ( yDiff > 0 )
	{
		div_area.style('top', ''+mouseYi);
		div_area.style('height', ''+yDiff);
	}
	else
	{
		div_area.style('top', ''+mouseY);
		div_area.style('height', ''+(mouseYi - mouseY));
	}

	if ( mouseX > 330 || mouseY > 150 )
		return false;
}

function mouseMoved()
{
	mouseX_ = mouseX;
	mouseY_ = mouseY;
	
	if ( mouseX > 330 || mouseY > 150 )
		return false;
}

function mouseClicked()
{
	if ( mouseX > 330 || mouseY > 150 )
		return false;
}

function mousePressed()
{
	if ( mouseX > 330 || mouseY > 150 )
	{
		mouseXi = mouseX;
		mouseYi = mouseY;

		div_area.style('visibility', 'initial');
		div_area.style('left', ''+mouseXi);
		div_area.style('top', ''+mouseYi);
		
		return false;
	}
}

function mouseReleased()
{
	div_area.style('width', '0');
	div_area.style('height', '0');
	div_area.style('visibility', 'hidden');
	
	if ( mouseX < 330 && mouseY < 150 ){	
		if ( hide )
			showUI();
		hide = !hide;
		return true;
	}
	
	div_area.style('visibility', 'hidden');
	
	mouseXf = mouseX;
	mouseYf = mouseY;
	
	if ( mouseX < mouseXi )
	{
		mouseXf = mouseXi;
		mouseXi = mouseX;
	}
	
	if ( mouseY < mouseYi )
	{
		mouseYf = mouseYi;
		mouseYi = mouseY;
	}
	
	var _minX = minX,
		_maxX = maxX,
		_minY = minY,
		_maxY = maxY;
	
	minX = map(mouseXi, 0, width, _minX, _maxX);
	maxX = map(mouseXf, 0, width, _minX, _maxX);
	
	minY = map(mouseYi, 0, height, _minY, _maxY);
	maxY = map(mouseYf, 0, height, _minY, _maxY);
	
	loop();
	
	return false;
}

function showUI()
{
	slider_iterations.style('visibility', 'initial');
	
	button_hide.style('visibility', 'initial');
	button_render.style('visibility', 'initial');
	button_reset.style('visibility', 'initial');

	label_iterations.style('visibility', 'initial');
	label_perf.style('visibility', 'initial');
	
	div_inputs.style('visibility', 'initial');
}

function hideUI()
{
	slider_iterations.style('visibility', 'hidden');
	
	button_hide.style('visibility', 'hidden');
	button_render.style('visibility', 'hidden');
	button_reset.style('visibility', 'hidden');
	
	label_iterations.style('visibility', 'hidden');
	label_perf.style('visibility', 'hidden');
	
	div_inputs.style('visibility', 'hidden');
}

function readInputs(updateTree)
{
	maxIterations = slider_iterations.value();
	label_iterations.html('Max iterations: ' + maxIterations);
	
	
	colorMode(HSL, maxIterations);
	
	for ( var i=0 ; i<maxIterations ; i++ )
	{
		var c = color('hsl(' + i + ',100%,50%)');
		
		colors.push(red(c));
		colors.push(green(c));
		colors.push(blue(c));
	}
}

function windowResized()
{
	resizeCanvas(windowWidth, windowHeight);
}

function reset()
{
	minX = minX_;
	maxX = maxX_;
	minY = minY_;
	maxY = maxY_;
	
	loop();
}

function makeFractal()
{
	loadPixels();
	
	var step = 2;
	if ( doRender )
		step = 1;
	
	for ( var x=0 ; x<width ; x+=step )
	{
		for ( var y=0 ; y<height ; y+=step )
		{
			var a = map(x, 0, width, minX, maxX);
			var b = map(y, 0, height, minY, maxY);
			var aa = a;
			var bb = b;
			
			var n = 0;
			
			var q = (a-1/4)*(a-1/4)+b*b
			if ( (q*(q+(a-1/4)) < 1/4*b*b) || ((a+1)*(a+1) + b*b < 1/16) )
				n = maxIterations;
			
			while ( n < maxIterations && aa*aa + bb*bb < 4 )
			{
				var aa_ = (aa*aa - bb*bb) + a;
				var bb_ = (2 * aa * bb) + b
				
				aa = aa_;
				bb = bb_;
				
				n++;
			}
			
			if ( n == maxIterations )
			{
				pixels[x*4 + y*width*4 + 0] = 0;
				pixels[x*4 + y*width*4 + 1] = 0;
				pixels[x*4 + y*width*4 + 2] = 0;
				pixels[x*4 + y*width*4 + 3] = 255;				
			}
			else
			{
				pixels[x*4 + y*width*4 + 0] = colors[n*3 + 0];
				pixels[x*4 + y*width*4 + 1] = colors[n*3 + 1];
				pixels[x*4 + y*width*4 + 2] = colors[n*3 + 2];
				pixels[x*4 + y*width*4 + 3] = 255;
			}
		}
	}
	
	updatePixels();
}

function draw()
{
	var startTime = millis();

	stroke(255, 255, 255);
	
	background(0, 0, 0);
	scale(1, -1);
	
	makeFractal();
	
	var endTime = millis();
	label_perf.html('Generated in ' + Math.floor((endTime - startTime) * 10) / 10 + 'ms');
	
	doRender = false;
	noLoop();
}