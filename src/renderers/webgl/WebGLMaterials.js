import { BackSide } from '../../constants.js';

function WebGLMaterials(properties) {
	function refreshFogUniforms(uniforms, fog) {
		uniforms.fogColor.value.copy(fog.color);

		if (fog.isFog) {
			uniforms.fogNear.value = fog.near;
			uniforms.fogFar.value = fog.far;
			return;
		}

		if (fog.isFogExp2) {
			uniforms.fogDensity.value = fog.density;
		}
	}

	function refreshMaterialUniforms(uniforms, material, pixelRatio, height) {
		if (material.isMeshBasicMaterial) {
			return refreshUniformsCommon(uniforms, material);
		}

		if (material.isMeshLambertMaterial) {
			refreshUniformsCommon(uniforms, material);
			return refreshUniformsLambert(uniforms, material);
		}

		if (material.isMeshToonMaterial) {
			refreshUniformsCommon(uniforms, material);
			return refreshUniformsToon(uniforms, material);
		}

		if (material.isMeshPhongMaterial) {
			refreshUniformsCommon(uniforms, material);
			return refreshUniformsPhong(uniforms, material);
		}

		if (material.isMeshStandardMaterial) {
			refreshUniformsCommon(uniforms, material);
			if (material.isMeshPhysicalMaterial) {
				return refreshUniformsPhysical(uniforms, material);
			}
			return refreshUniformsStandard(uniforms, material);
		}

		if (material.isMeshMatcapMaterial) {
			refreshUniformsCommon(uniforms, material);
			return refreshUniformsMatcap(uniforms, material);
		}

		if (material.isMeshDepthMaterial) {
			refreshUniformsCommon(uniforms, material);
			return refreshUniformsDepth(uniforms, material);
		}

		if (material.isMeshDistanceMaterial) {
			refreshUniformsCommon(uniforms, material);
			return refreshUniformsDistance(uniforms, material);
		}

		if (material.isMeshNormalMaterial) {
			refreshUniformsCommon(uniforms, material);
			return refreshUniformsNormal(uniforms, material);
		}

		if (material.isLineBasicMaterial) {
			refreshUniformsLine(uniforms, material);
			if (material.isLineDashedMaterial) {
				refreshUniformsDash(uniforms, material);
			}
			return;
		}

		if (material.isPointsMaterial) {
			return refreshUniformsPoints(uniforms, material, pixelRatio, height);
		}

		if (material.isSpriteMaterial) {
			return refreshUniformsSprites(uniforms, material);
		}

		if (material.isShadowMaterial) {
			uniforms.color.value.copy(material.color);
			uniforms.opacity.value = material.opacity;
			return;
		}

		if (material.isShaderMaterial) {
			material.uniformsNeedUpdate = false;
		}
	}

	function refreshUniformsCommon(uniforms, material) {
		uniforms.opacity.value = material.opacity;

		if (material.color) {
			uniforms.diffuse.value.copy(material.color);
		}

		if (material.emissive) {
			uniforms.emissive.value.copy(material.emissive).multiplyScalar(material.emissiveIntensity);
		}

		if (material.map) {
			uniforms.map.value = material.map;
		}

		if (material.alphaMap) {
			uniforms.alphaMap.value = material.alphaMap;
		}

		if (material.specularMap) {
			uniforms.specularMap.value = material.specularMap;
		}

		const envMap = properties.get(material).envMap;

		if (envMap) {
			uniforms.envMap.value = envMap;
			uniforms.flipEnvMap.value = (envMap.isCubeTexture && envMap._needsFlipEnvMap) ? -1 : 1;
			uniforms.reflectivity.value = material.reflectivity;
			uniforms.refractionRatio.value = material.refractionRatio;

			const maxMipLevel = properties.get(envMap).__maxMipLevel;
			if (maxMipLevel !== undefined) {
				uniforms.maxMipLevel.value = maxMipLevel;
			}
		}

		if (material.lightMap) {
			uniforms.lightMap.value = material.lightMap;
			uniforms.lightMapIntensity.value = material.lightMapIntensity;
		}

		if (material.aoMap) {
			uniforms.aoMap.value = material.aoMap;
			uniforms.aoMapIntensity.value = material.aoMapIntensity;
		}

		// uv repeat and offset setting priorities
		// 1. color map
		// 2. specular map
		// 3. displacementMap map
		// 4. normal map
		// 5. bump map
		// 6. roughnessMap map
		// 7. metalnessMap map
		// 8. alphaMap map
		// 9. emissiveMap map
		// 10. clearcoat map
		// 11. clearcoat normal map
		// 12. clearcoat roughnessMap map

		let uvScaleMap = material.map
			|| material.specularMap
			|| material.displacementMap
			|| material.normalMap
			|| material.bumpMap
			|| material.roughnessMap
			|| material.metalnessMap
			|| material.alphaMap
			|| material.emissiveMap
			|| material.clearcoatMap
			|| material.clearcoatNormalMap
			|| material.clearcoatRoughnessMap;

		if (uvScaleMap) {
			// backwards compatibility
			if (uvScaleMap.isWebGLRenderTarget) {
				uvScaleMap = uvScaleMap.texture;
			}

			if (uvScaleMap.matrixAutoUpdate === true) {
				uvScaleMap.updateMatrix();
			}

			uniforms.uvTransform.value.copy(uvScaleMap.matrix);
		}

		// uv repeat and offset setting priorities for uv2
		// 1. ao map
		// 2. light map

		let uv2ScaleMap = material.aoMap || material.lightMap;

		if (uv2ScaleMap) {
			// backwards compatibility
			if (uv2ScaleMap.isWebGLRenderTarget) {
				uv2ScaleMap = uv2ScaleMap.texture;
			}

			if (uv2ScaleMap.matrixAutoUpdate === true) {
				uv2ScaleMap.updateMatrix();
			}

			uniforms.uv2Transform.value.copy(uv2ScaleMap.matrix);
		}
	}

	function refreshUniformsLine(uniforms, material) {
		uniforms.diffuse.value.copy(material.color);
		uniforms.opacity.value = material.opacity;
	}

	function refreshUniformsDash(uniforms, material) {
		uniforms.dashSize.value = material.dashSize;
		uniforms.totalSize.value = material.dashSize + material.gapSize;
		uniforms.scale.value = material.scale;
	}

	function refreshUniformsPoints(uniforms, material, pixelRatio, height) {
		uniforms.diffuse.value.copy(material.color);
		uniforms.opacity.value = material.opacity;
		uniforms.size.value = material.size * pixelRatio;
		uniforms.scale.value = height * 0.5;

		if (material.map) {
			uniforms.map.value = material.map;
		}

		if (material.alphaMap) {
			uniforms.alphaMap.value = material.alphaMap;
		}

		// uv repeat and offset setting priorities
		// 1. color map
		// 2. alpha map

		const uvScaleMap = material.map || material.alphaMap;

		if (uvScaleMap) {
			if (uvScaleMap.matrixAutoUpdate === true) {
				uvScaleMap.updateMatrix();
			}

			uniforms.uvTransform.value.copy(uvScaleMap.matrix);
		}
	}

	function refreshUniformsSprites(uniforms, material) {
		uniforms.diffuse.value.copy(material.color);
		uniforms.opacity.value = material.opacity;
		uniforms.rotation.value = material.rotation;

		if (material.map) {
			uniforms.map.value = material.map;
		}

		if (material.alphaMap) {
			uniforms.alphaMap.value = material.alphaMap;
		}

		// uv repeat and offset setting priorities
		// 1. color map
		// 2. alpha map

		const uvScaleMap = material.map || material.alphaMap;

		if (uvScaleMap) {
			if (uvScaleMap.matrixAutoUpdate === true) {
				uvScaleMap.updateMatrix();
			}

			uniforms.uvTransform.value.copy(uvScaleMap.matrix);
		}
	}

	function refreshUniformsLambert(uniforms, material) {
		if (material.emissiveMap) {
			uniforms.emissiveMap.value = material.emissiveMap;
		}
	}

	function refreshUniformsPhong(uniforms, material) {
		uniforms.specular.value.copy(material.specular);
		uniforms.shininess.value = Math.max(material.shininess, 1e-4); // to prevent pow( 0.0, 0.0 )

		if (material.emissiveMap) {
			uniforms.emissiveMap.value = material.emissiveMap;
		}

		if (material.bumpMap) {
			uniforms.bumpMap.value = material.bumpMap;
			uniforms.bumpScale.value = material.bumpScale;
			if (material.side === BackSide) uniforms.bumpScale.value *= -1;
		}

		if (material.normalMap) {
			uniforms.normalMap.value = material.normalMap;
			uniforms.normalScale.value.copy(material.normalScale);
			if (material.side === BackSide) uniforms.normalScale.value.negate();
		}

		if (material.displacementMap) {
			uniforms.displacementMap.value = material.displacementMap;
			uniforms.displacementScale.value = material.displacementScale;
			uniforms.displacementBias.value = material.displacementBias;
		}
	}

	function refreshUniformsToon(uniforms, material) {
		if (material.gradientMap) {
			uniforms.gradientMap.value = material.gradientMap;
		}

		if (material.emissiveMap) {
			uniforms.emissiveMap.value = material.emissiveMap;
		}

		if (material.bumpMap) {
			uniforms.bumpMap.value = material.bumpMap;
			uniforms.bumpScale.value = material.bumpScale;
			if (material.side === BackSide) uniforms.bumpScale.value *= -1;
		}

		if (material.normalMap) {
			uniforms.normalMap.value = material.normalMap;
			uniforms.normalScale.value.copy(material.normalScale);
			if (material.side === BackSide) uniforms.normalScale.value.negate();
		}

		if (material.displacementMap) {
			uniforms.displacementMap.value = material.displacementMap;
			uniforms.displacementScale.value = material.displacementScale;
			uniforms.displacementBias.value = material.displacementBias;
		}
	}

	function refreshUniformsStandard(uniforms, material) {
		uniforms.roughness.value = material.roughness;
		uniforms.metalness.value = material.metalness;

		if (material.roughnessMap) {
			uniforms.roughnessMap.value = material.roughnessMap;
		}

		if (material.metalnessMap) {
			uniforms.metalnessMap.value = material.metalnessMap;
		}

		if (material.emissiveMap) {
			uniforms.emissiveMap.value = material.emissiveMap;
		}

		if (material.bumpMap) {
			uniforms.bumpMap.value = material.bumpMap;
			uniforms.bumpScale.value = material.bumpScale;
			if (material.side === BackSide) uniforms.bumpScale.value *= -1;
		}

		if (material.normalMap) {
			uniforms.normalMap.value = material.normalMap;
			uniforms.normalScale.value.copy(material.normalScale);
			if (material.side === BackSide) uniforms.normalScale.value.negate();
		}

		if (material.displacementMap) {
			uniforms.displacementMap.value = material.displacementMap;
			uniforms.displacementScale.value = material.displacementScale;
			uniforms.displacementBias.value = material.displacementBias;
		}

		const envMap = properties.get(material).envMap;

		if (envMap) {
			//uniforms.envMap.value = material.envMap; // part of uniforms common
			uniforms.envMapIntensity.value = material.envMapIntensity;
		}
	}

	function refreshUniformsPhysical(uniforms, material) {
		refreshUniformsStandard(uniforms, material);

		uniforms.reflectivity.value = material.reflectivity; // also part of uniforms common

		uniforms.clearcoat.value = material.clearcoat;
		uniforms.clearcoatRoughness.value = material.clearcoatRoughness;
		if (material.sheen) uniforms.sheen.value.copy(material.sheen);

		if (material.clearcoatMap) {
			uniforms.clearcoatMap.value = material.clearcoatMap;
		}

		if (material.clearcoatRoughnessMap) {
			uniforms.clearcoatRoughnessMap.value = material.clearcoatRoughnessMap;
		}

		if (material.clearcoatNormalMap) {
			uniforms.clearcoatNormalScale.value.copy(material.clearcoatNormalScale);
			uniforms.clearcoatNormalMap.value = material.clearcoatNormalMap;

			if (material.side === BackSide) {
				uniforms.clearcoatNormalScale.value.negate();
			}
		}

		uniforms.transmission.value = material.transmission;

		if (material.transmissionMap) {
			uniforms.transmissionMap.value = material.transmissionMap;
		}
	}

	function refreshUniformsMatcap(uniforms, material) {
		if (material.matcap) {
			uniforms.matcap.value = material.matcap;
		}

		if (material.bumpMap) {
			uniforms.bumpMap.value = material.bumpMap;
			uniforms.bumpScale.value = material.bumpScale;
			if (material.side === BackSide) uniforms.bumpScale.value *= -1;
		}

		if (material.normalMap) {
			uniforms.normalMap.value = material.normalMap;
			uniforms.normalScale.value.copy(material.normalScale);
			if (material.side === BackSide) uniforms.normalScale.value.negate();
		}

		if (material.displacementMap) {
			uniforms.displacementMap.value = material.displacementMap;
			uniforms.displacementScale.value = material.displacementScale;
			uniforms.displacementBias.value = material.displacementBias;
		}
	}

	function refreshUniformsDepth(uniforms, material) {
		if (material.displacementMap) {
			uniforms.displacementMap.value = material.displacementMap;
			uniforms.displacementScale.value = material.displacementScale;
			uniforms.displacementBias.value = material.displacementBias;
		}
	}

	function refreshUniformsDistance(uniforms, material) {
		if (material.displacementMap) {
			uniforms.displacementMap.value = material.displacementMap;
			uniforms.displacementScale.value = material.displacementScale;
			uniforms.displacementBias.value = material.displacementBias;
		}

		uniforms.referencePosition.value.copy(material.referencePosition);
		uniforms.nearDistance.value = material.nearDistance;
		uniforms.farDistance.value = material.farDistance;
	}

	function refreshUniformsNormal(uniforms, material) {
		if (material.bumpMap) {
			uniforms.bumpMap.value = material.bumpMap;
			uniforms.bumpScale.value = material.bumpScale;
			if (material.side === BackSide) uniforms.bumpScale.value *= -1;
		}

		if (material.normalMap) {
			uniforms.normalMap.value = material.normalMap;
			uniforms.normalScale.value.copy(material.normalScale);
			if (material.side === BackSide) uniforms.normalScale.value.negate();
		}

		if (material.displacementMap) {
			uniforms.displacementMap.value = material.displacementMap;
			uniforms.displacementScale.value = material.displacementScale;
			uniforms.displacementBias.value = material.displacementBias;
		}
	}

	return {
		refreshFogUniforms: refreshFogUniforms,
		refreshMaterialUniforms: refreshMaterialUniforms,
	};
}

export { WebGLMaterials };
