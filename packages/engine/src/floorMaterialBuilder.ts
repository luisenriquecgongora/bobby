// @takient/core/src/3d/floorMaterialBuilder.ts
// Floor Material Builder with Preset Library

import * as THREE from 'three';
import { FloorMaterial, FloorMaterialPreset } from './floorMaterialTypes';
import {
  generateWoodTexture,
  generateTileTexture,
  generateMarbleTexture,
  generateCheckerboardTexture,
  generateHexagonTexture,
  generateHerringboneTexture,
  generateConcreteTexture,
  generateRunningBondTexture,
  generateBasketweaveTexture,
  generateVersaillesTexture,
  generateWindmillTexture,
  generateOctagonDotTexture,
  generateDiagonalGridTexture,
} from './proceduralTextures';

/**
 * Floor Material Builder
 * Creates Three.js materials from floor material configurations
 */
export class FloorMaterialBuilder {
  private static textureCache = new Map<string, THREE.Texture>();

  /**
   * Preset material library (15 presets)
   */
  static readonly PRESETS: FloorMaterialPreset[] = [
    // WOOD CATEGORY (5 presets)
    {
      id: 'oak-light',
      name: 'Light Oak',
      description: 'Natural light oak wood planks',
      category: 'wood',
      material: {
        type: 'procedural',
        pattern: 'wood',
        metalness: 0.1,
        roughness: 0.9,
        patternConfig: {
          primaryColor: '#D4A574',
          plankWidth: 15,
          plankLength: 120,
          variation: 0.2,
        },
      },
    },
    {
      id: 'walnut-dark',
      name: 'Dark Walnut',
      description: 'Rich dark walnut wood planks',
      category: 'wood',
      material: {
        type: 'procedural',
        pattern: 'wood',
        metalness: 0.15,
        roughness: 0.85,
        patternConfig: {
          primaryColor: '#5C4033',
          plankWidth: 15,
          plankLength: 120,
          variation: 0.25,
        },
      },
    },
    {
      id: 'oak-herringbone',
      name: 'Oak Herringbone',
      description: 'Classic herringbone oak pattern',
      category: 'wood',
      material: {
        type: 'procedural',
        pattern: 'herringbone',
        metalness: 0.1,
        roughness: 0.9,
        patternConfig: {
          primaryColor: '#A0826D',
          plankWidth: 8,
          plankLength: 40,
          variation: 0.15,
        },
      },
    },
    {
      id: 'bamboo-natural',
      name: 'Natural Bamboo',
      description: 'Eco-friendly bamboo flooring',
      category: 'wood',
      material: {
        type: 'procedural',
        pattern: 'wood',
        metalness: 0.2,
        roughness: 0.8,
        patternConfig: {
          primaryColor: '#D2B48C',
          plankWidth: 12,
          plankLength: 90,
          variation: 0.1,
        },
      },
    },
    {
      id: 'mahogany-rich',
      name: 'Rich Mahogany',
      description: 'Deep reddish-brown mahogany',
      category: 'wood',
      material: {
        type: 'procedural',
        pattern: 'wood',
        metalness: 0.2,
        roughness: 0.7,
        patternConfig: {
          primaryColor: '#8B4513',
          plankWidth: 18,
          plankLength: 150,
          variation: 0.2,
        },
      },
    },

    // STONE/MARBLE CATEGORY (3 presets)
    {
      id: 'marble-white',
      name: 'White Marble',
      description: 'Elegant white marble with gray veins',
      category: 'stone',
      material: {
        type: 'procedural',
        pattern: 'marble',
        metalness: 0.3,
        roughness: 0.5,
        patternConfig: {
          primaryColor: '#F5F5F5',
          secondaryColor: '#D0D0D0',
        },
      },
    },
    {
      id: 'granite-black',
      name: 'Black Granite',
      description: 'Polished black granite',
      category: 'stone',
      material: {
        type: 'procedural',
        pattern: 'marble',
        metalness: 0.4,
        roughness: 0.3,
        patternConfig: {
          primaryColor: '#2C2C2C',
          secondaryColor: '#404040',
        },
      },
    },
    {
      id: 'limestone-beige',
      name: 'Beige Limestone',
      description: 'Warm beige limestone tiles',
      category: 'stone',
      material: {
        type: 'procedural',
        pattern: 'tile',
        metalness: 0.1,
        roughness: 0.8,
        patternConfig: {
          primaryColor: '#E8DCC5',
          groutColor: '#C4B5A0',
          tileSize: 60,
          variation: 0.1,
        },
      },
    },

    // TILE CATEGORY (3 presets)
    {
      id: 'ceramic-white',
      name: 'White Ceramic',
      description: 'Clean white ceramic tiles',
      category: 'tile',
      material: {
        type: 'procedural',
        pattern: 'tile',
        metalness: 0.15,
        roughness: 0.6,
        patternConfig: {
          primaryColor: '#FAFAFA',
          groutColor: '#CCCCCC',
          tileSize: 30,
          variation: 0.05,
        },
      },
    },
    {
      id: 'porcelain-gray',
      name: 'Gray Porcelain',
      description: 'Modern gray porcelain tiles',
      category: 'tile',
      material: {
        type: 'procedural',
        pattern: 'tile',
        metalness: 0.2,
        roughness: 0.5,
        patternConfig: {
          primaryColor: '#9E9E9E',
          groutColor: '#757575',
          tileSize: 40,
          variation: 0.1,
        },
      },
    },
    {
      id: 'terracotta-red',
      name: 'Terracotta Red',
      description: 'Rustic terracotta tiles',
      category: 'tile',
      material: {
        type: 'procedural',
        pattern: 'tile',
        metalness: 0.05,
        roughness: 0.95,
        patternConfig: {
          primaryColor: '#C35831',
          groutColor: '#9B4528',
          tileSize: 35,
          variation: 0.2,
        },
      },
    },

    // MODERN CATEGORY (2 presets)
    {
      id: 'concrete-polished',
      name: 'Polished Concrete',
      description: 'Industrial polished concrete',
      category: 'modern',
      material: {
        type: 'procedural',
        pattern: 'concrete',
        metalness: 0.3,
        roughness: 0.4,
        patternConfig: {
          primaryColor: '#B0B0B0',
        },
      },
    },
    {
      id: 'slate-dark',
      name: 'Dark Slate',
      description: 'Modern dark slate finish',
      category: 'modern',
      material: {
        type: 'color',
        color: '#2C3E50',
        metalness: 0.2,
        roughness: 0.8,
      },
    },

    // PATTERN CATEGORY (8 presets - EXPANDED!)
    {
      id: 'checkerboard-bw',
      name: 'Black & White',
      description: 'Classic checkerboard pattern',
      category: 'pattern',
      material: {
        type: 'procedural',
        pattern: 'checkerboard',
        metalness: 0.2,
        roughness: 0.6,
        patternConfig: {
          primaryColor: '#FFFFFF',
          secondaryColor: '#000000',
          tileSize: 50,
        },
      },
    },
    {
      id: 'hexagon-mosaic',
      name: 'Hexagon Mosaic',
      description: 'Geometric hexagon tiles',
      category: 'pattern',
      material: {
        type: 'procedural',
        pattern: 'hexagon',
        metalness: 0.15,
        roughness: 0.7,
        patternConfig: {
          primaryColor: '#E0E0E0',
          groutColor: '#A0A0A0',
          tileSize: 20,
        },
      },
    },
    {
      id: 'subway-white',
      name: 'White Subway',
      description: 'Classic white subway tiles',
      category: 'pattern',
      material: {
        type: 'procedural',
        pattern: 'running-bond',
        metalness: 0.2,
        roughness: 0.5,
        patternConfig: {
          primaryColor: '#FAFAFA',
          groutColor: '#D0D0D0',
          plankLength: 60,
          plankWidth: 20,
          variation: 0.03,
        },
      },
    },
    {
      id: 'basketweave-natural',
      name: 'Natural Basketweave',
      description: 'Woven pattern with natural tones',
      category: 'pattern',
      material: {
        type: 'procedural',
        pattern: 'basketweave',
        metalness: 0.1,
        roughness: 0.9,
        patternConfig: {
          primaryColor: '#D4A574',
          secondaryColor: '#B08D5D',
          groutColor: '#8B7355',
          tileSize: 30,
        },
      },
    },
    {
      id: 'versailles-travertine',
      name: 'Travertine Versailles',
      description: 'Luxury French pattern',
      category: 'pattern',
      material: {
        type: 'procedural',
        pattern: 'versailles',
        metalness: 0.15,
        roughness: 0.7,
        patternConfig: {
          primaryColor: '#C9B896',
          groutColor: '#9B8B73',
          variation: 0.15,
        },
      },
    },
    {
      id: 'windmill-gray',
      name: 'Gray Windmill',
      description: 'Modern windmill layout',
      category: 'pattern',
      material: {
        type: 'procedural',
        pattern: 'windmill',
        metalness: 0.2,
        roughness: 0.6,
        patternConfig: {
          primaryColor: '#D0D0D0',
          secondaryColor: '#B0B0B0',
          groutColor: '#909090',
        },
      },
    },
    {
      id: 'octagon-victorian',
      name: 'Victorian Octagon',
      description: 'Classic octagon & dot',
      category: 'pattern',
      material: {
        type: 'procedural',
        pattern: 'octagon-dot',
        metalness: 0.15,
        roughness: 0.7,
        patternConfig: {
          primaryColor: '#FFFFFF',
          secondaryColor: '#2C3E50',
          groutColor: '#95A5A6',
          tileSize: 40,
        },
      },
    },
    {
      id: 'diagonal-ceramic',
      name: 'Diagonal Ceramic',
      description: 'Tiles rotated 45 degrees',
      category: 'pattern',
      material: {
        type: 'procedural',
        pattern: 'diagonal-grid',
        metalness: 0.2,
        roughness: 0.6,
        patternConfig: {
          primaryColor: '#F5F5F5',
          groutColor: '#C8C8C8',
          tileSize: 30,
          variation: 0.08,
        },
      },
    },
  ];

  /**
   * Create a Three.js material from a floor material configuration
   */
  static createMaterial(config: FloorMaterial): THREE.MeshStandardMaterial {
    const material = new THREE.MeshStandardMaterial({
      metalness: config.metalness ?? 0.1,
      roughness: config.roughness ?? 0.9,
    });

    if (config.type === 'color') {
      // Simple solid color
      material.color = new THREE.Color(config.color || '#111827');
    } else if (config.type === 'procedural' && config.pattern && config.patternConfig) {
      // Procedural texture generation
      const texture = this.generateProceduralTexture(config.pattern, config.patternConfig);
      material.map = texture;

      // Apply rotation if specified
      if (config.rotation) {
        texture.rotation = (config.rotation * Math.PI) / 180;
        texture.center.set(0.5, 0.5);
      }

      // Apply scale if specified
      if (config.scale && config.scale !== 1.0) {
        texture.repeat.set(config.scale, config.scale);
      }
    } else if (config.type === 'texture' && config.textureURL) {
      // External texture (for future custom uploads)
      const loader = new THREE.TextureLoader();
      const texture = loader.load(config.textureURL);
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      material.map = texture;

      // Load normal map if provided
      if (config.normalMapURL) {
        material.normalMap = loader.load(config.normalMapURL);
      }

      // Load roughness map if provided
      if (config.roughnessMapURL) {
        material.roughnessMap = loader.load(config.roughnessMapURL);
      }
    }

    material.needsUpdate = true;
    return material;
  }

  /**
   * Generate procedural texture based on pattern type
   */
  private static generateProceduralTexture(
    pattern: string,
    config: any
  ): THREE.CanvasTexture {
    // Check cache first
    const cacheKey = `${pattern}-${JSON.stringify(config)}`;
    if (this.textureCache.has(cacheKey)) {
      return this.textureCache.get(cacheKey)!.clone() as THREE.CanvasTexture;
    }

    let texture: THREE.CanvasTexture;

    switch (pattern) {
      case 'wood':
        texture = generateWoodTexture(config);
        break;
      case 'tile':
        texture = generateTileTexture(config);
        break;
      case 'marble':
        texture = generateMarbleTexture(config);
        break;
      case 'checkerboard':
        texture = generateCheckerboardTexture(config);
        break;
      case 'hexagon':
        texture = generateHexagonTexture(config);
        break;
      case 'herringbone':
        texture = generateHerringboneTexture(config);
        break;
      case 'concrete':
        texture = generateConcreteTexture(config);
        break;
      case 'running-bond':
        texture = generateRunningBondTexture(config);
        break;
      case 'basketweave':
        texture = generateBasketweaveTexture(config);
        break;
      case 'versailles':
        texture = generateVersaillesTexture(config);
        break;
      case 'windmill':
        texture = generateWindmillTexture(config);
        break;
      case 'octagon-dot':
        texture = generateOctagonDotTexture(config);
        break;
      case 'diagonal-grid':
        texture = generateDiagonalGridTexture(config);
        break;
      default:
        // Fallback to solid color
        texture = generateConcreteTexture({ primaryColor: '#808080' });
    }

    // Cache the texture
    this.textureCache.set(cacheKey, texture);

    return texture;
  }

  /**
   * Get preset by ID
   */
  static getPreset(id: string): FloorMaterialPreset | undefined {
    return this.PRESETS.find((preset) => preset.id === id);
  }

  /**
   * Get presets by category
   */
  static getPresetsByCategory(category: string): FloorMaterialPreset[] {
    return this.PRESETS.filter((preset) => preset.category === category);
  }

  /**
   * Get all preset categories
   */
  static getCategories(): string[] {
    return Array.from(new Set(this.PRESETS.map((p) => p.category)));
  }

  /**
   * Clear texture cache
   */
  static clearCache() {
    this.textureCache.forEach((texture) => texture.dispose());
    this.textureCache.clear();
  }
}
