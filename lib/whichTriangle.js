(function($) {
	var _wtTriangles = [],
		_wtMidPoints = [],
		_wtSettings = [],
		_wtElements = [];
	$.fn.setupTriangles = function(opt) {
		var res = _setupTheValues(this),
			settings = $.extend({
				"midDiameter": 0
			}, opt);

		settings.midDiameter = Math.abs(settings.midDiameter);

		var index = _searchArray(_wtElements, this.get(0));

		if (index < 0)
			index = _wtElements.push(this.get(0)) - 1;

		_wtTriangles[index] = res[0];
		_wtSettings[index] = settings;
		_wtMidPoints[index] = {
			mid: res[2],
			radius: settings.midDiameter / 2
		};

		return this;
	};

	$.fn.whichTriangle = function(evt) {
		var index = _searchArray(_wtElements, this.get(0));
		var point = [evt.clientX + $(window).scrollLeft(), evt.clientY + $(window).scrollTop()];
		var res = _whichTriangleIsPointIn(_wtTriangles[index], point);

		if (_wtMidPoints[index].radius)
			if (_isItInTheMiddle(_wtMidPoints[index], point))
				res = _wtTriangles[index].length;

		return res;
	};

	$.fn.updateTriangles = function() {
		var $this = $(this);
		var index = _searchArray(_wtElements, this.get(0));
		$this.setupTriangles(_wtSettings[index]);
	};

	function _setupTheValues(elem) {

		/* READ THIS:
		All the Math.operations are there to take into account subpixel rendering that is
		performed by modern browsers. Due to this we end up getting left/top/height/width/all 
		as floats and hence I have rounded them off to basically snap to the closest whole pixel value.
		For eg., x1 is snapped to its Math.floor so that the decimal left value snaps to its closest
		left whole pixel value. Same way x2 is snapped to the closest whole pixel on its right.
		Yes this may make the element logically bigger but we are talking about differences of 0.x pixels.
		IMHO thats ok.
		*/
		_setupTheValues.left = (elem.offset()).left;
		_setupTheValues.top = (elem.offset()).top;
		_setupTheValues.ht = elem.height();
		_setupTheValues.wd = elem.width();
		_setupTheValues.midX = _setupTheValues.left + (_setupTheValues.wd / 2);
		_setupTheValues.midY = _setupTheValues.top + (_setupTheValues.ht / 2);
		_setupTheValues.x1 = Math.floor(_setupTheValues.left);
		_setupTheValues.y1 = Math.floor(_setupTheValues.top); //x1 y1 are top left corner
		_setupTheValues.x2 = Math.ceil(_setupTheValues.left) + _setupTheValues.wd;
		_setupTheValues.y2 = Math.floor(_setupTheValues.top); //x2 y2 are top right corner
		_setupTheValues.x3 = Math.ceil(_setupTheValues.left) + _setupTheValues.wd;
		_setupTheValues.y3 = Math.ceil(_setupTheValues.top) + _setupTheValues.ht;
		_setupTheValues.x4 = Math.floor(_setupTheValues.left);
		_setupTheValues.y4 = Math.ceil(_setupTheValues.top) + _setupTheValues.ht;
		_setupTheValues.triangles = _getTrianglesArr(_setupTheValues.x1, _setupTheValues.y1, _setupTheValues.x2, _setupTheValues.y2, _setupTheValues.x3, _setupTheValues.y3, _setupTheValues.x4, _setupTheValues.y4, _setupTheValues.midX, _setupTheValues.midY);


		/*0 -> triangles, 1 -> index, 2 -> midPoint*/
		return [_setupTheValues.triangles, "" + _setupTheValues.left + _setupTheValues.top + _setupTheValues.ht + _setupTheValues.wd, [_setupTheValues.midX, _setupTheValues.midY]];
	}

	function _getTrianglesArr(x1, y1, x2, y2, x3, y3, x4, y4, midX, midY) {
		var arr = [],
			x1y1 = [x1, y1],
			x2y2 = [x2, y2],
			x3y3 = [x3, y3],
			x4y4 = [x4, y4],
			midXmidY = [midX, midY];

		//triangle 1 is (midX, midY) (x1,y1) (x2,y2)
		arr[0] = [];
		arr[0].push(midXmidY);
		arr[0].push(x1y1);
		arr[0].push(x2y2);

		//triangle 2 is (midX, midY) (x2,y2) (x3,y3)
		arr[1] = [];
		arr[1].push(midXmidY);
		arr[1].push(x2y2);
		arr[1].push(x3y3);

		//triangle 3 is (midX, midY) (x3,y3) (x4,y4)
		arr[2] = [];
		arr[2].push(midXmidY);
		arr[2].push(x3y3);
		arr[2].push(x4y4);

		//triangle 4 is (midX, midY) (x4,y4) (x1,y1)
		arr[3] = [];
		arr[3].push(midXmidY);
		arr[3].push(x4y4);
		arr[3].push(x1y1);

		return arr;
	}

	/*0 -> top triangle, 1-> right triangle, 2-> bottom triangle, 3-> left triangle*/

	function _whichTriangleIsPointIn(triangles, point) {
		for (var i = 0; i < triangles.length; i++) {
			var tr = triangles[i];
			var alpha = (((tr[1][1] - tr[2][1]) * (point[0] - tr[2][0])) + ((tr[2][0] - tr[1][0]) * (point[1] - tr[2][1]))) / (((tr[1][1] - tr[2][1]) * (tr[0][0] - tr[2][0])) + ((tr[2][0] - tr[1][0]) * (tr[0][1] - tr[2][1]))),

				beta = (((tr[2][1] - tr[0][1]) * (point[0] - tr[2][0])) + ((tr[0][0] - tr[2][0]) * (point[1] - tr[2][1]))) / (((tr[1][1] - tr[2][1]) * (tr[0][0] - tr[2][0])) + ((tr[2][0] - tr[1][0]) * (tr[0][1] - tr[2][1]))),

				gamma = 1 - alpha - beta;


			if (!(0 <= alpha && alpha <= 1))
				continue;

			if (!(0 <= beta && beta <= 1))
				continue;

			if (!(0 <= gamma && gamma <= 1))
				continue;

			/*break if 0<= alpha,beta,gamma <=1*/
			break;
		}
		if (i == triangles.length)
			i = -1;
		return i;
	}
	/*Test whether the coords fall in the circle with center at (midX,midY) and radius = midDiameter/2*/

	function _isItInTheMiddle(midObj, point) {
		var dsqr = Math.pow((point[0] - midObj.mid[0]), 2) + Math.pow((point[1] - midObj.mid[1]), 2);
		var rsqr = Math.pow(midObj.radius, 2);
		if (dsqr <= rsqr)
			return true;
		else
			return false;
	}

	function _searchArray(arr, el) {
		for (var i = 0; i < arr.length; i++)
			if (arr[i] === el)
				break;
		if (i >= arr.length)
			i = -1;
		return i;
	}

})(jQuery);