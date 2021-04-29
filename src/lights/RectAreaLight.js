import { Light } from './Light.js';

class RectAreaLight extends Light {

	constructor( color, intensity, width = 10, height = 10 ) {

		super( color, intensity );

		this.type = 'RectAreaLight';

		this.width = width;
		this.height = height;

	}

	copy( source ) {

		super.copy( source );

		this.width = source.width;
		this.height = source.height;

		return this;

	}

}

RectAreaLight.prototype.isRectAreaLight = true;

export { RectAreaLight };
