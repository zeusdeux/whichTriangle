(function($) {
	var setupTriangles = {};
	$.fn.setupTriangles = function(opt) {
		var res = _setupTheValues(this);
		setupTriangles[res[1]] = res[0];
		return this;
	};

	$.fn.whichTriangle = function(evt) {
		var $this = $(this);
		var $offset = $this.offset();
		var index = ""+$offset.left+$offset.top+$this.height()+$this.width();
		var res =  _whichTriangleIsPointIn(setupTriangles[index], [evt.clientX, evt.clientY]);
		return res;
	};

	$.fn.updateTriangles = function(opt) {
		this.setupTriangles();
	};

	function _setupTheValues(elem) {
		_setupTheValues.left = (elem.offset()).left,
		_setupTheValues.top = (elem.offset()).top,
		_setupTheValues.ht = elem.height(),
		_setupTheValues.wd = elem.width(),
		_setupTheValues.midX = _setupTheValues.left + (_setupTheValues.wd / 2),
		_setupTheValues.midY = _setupTheValues.top + (_setupTheValues.ht / 2),
		_setupTheValues.x1 = _setupTheValues.left,
		_setupTheValues.y1 = _setupTheValues.top, //x1 y1 are top left corner
		_setupTheValues.x2 = _setupTheValues.left + _setupTheValues.wd,
		_setupTheValues.y2 = _setupTheValues.top, //x2 y2 are top right corner
		_setupTheValues.x3 = _setupTheValues.left + _setupTheValues.wd,
		_setupTheValues.y3 = _setupTheValues.top + _setupTheValues.ht,
		_setupTheValues.x4 = _setupTheValues.left,
		_setupTheValues.y4 = _setupTheValues.top + _setupTheValues.ht,
		_setupTheValues.triangles = _getTrianglesArr(_setupTheValues.x1, _setupTheValues.y1, _setupTheValues.x2, _setupTheValues.y2, _setupTheValues.x3, _setupTheValues.y3, _setupTheValues.x4, _setupTheValues.y4, _setupTheValues.midX, _setupTheValues.midY);

		return [_setupTheValues.triangles, ""+_setupTheValues.left+_setupTheValues.top+_setupTheValues.ht+_setupTheValues.wd];
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

})(jQuery);