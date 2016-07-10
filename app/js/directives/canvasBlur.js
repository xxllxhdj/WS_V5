
angular.module('WorkStation.directives')

.directive('canvasBlur', function () {
	return {
		restrict: 'E',
		replace: true,
		template: '<canvas></canvas>',
		link: function($scope, $element, $attr) {
			var img = new Image();
			img.src = $attr.imgSrc;
			img.onload = function () {
				var canvas = $element[0],
					parentDom = $element.parent();

				canvas.width = parentDom.width();
				canvas.height = parentDom.height();

				var sw = canvas.width,
					sh = canvas.height;
				if (sw > img.width) {
					sh = img.width * sh / sw;
					sw = img.width;
				}
				if (sh > img.height) {
					sw = img.height * sw / sh;
					sh = img.height;
				}

				var context = canvas.getContext('2d');
				context.drawImage(
					img, 
					(img.width - sw) / 2, (img.height - sh) / 2, sw, sh,
					0, 0, canvas.width, canvas.height
				);

				window.StackBlur.canvasRGB(canvas, 0, 0, canvas.width, canvas.height, $attr.radius);
			};
		}
	};
});