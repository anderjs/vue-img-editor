#version 300 es

precision highp float;
uniform float uBlack;
uniform float uWhites;
uniform float uShadows;
uniform float uContrast;
uniform float uExposure;
uniform float uHighlights;
uniform sampler2D uImage;

in vec2 vUv;
out vec4 fragColor;

void main() {
    vec3 color = texture(uImage, vUv).rgb;

    float luminance = dot(
            color,
            vec3(0.2126, 0.7152, 0.0722)
        );

    float highlightsMask = smoothstep(
            0.5,
            1.0,
            luminance
        );
    float shadowsMask = 1.0 - smoothstep(
            0.0,
            0.5,
            luminance
        );
    float blacksMask = 1.0 - smoothstep(
            0.0,
            0.25,
            luminance
        );
    float whitesMask = smoothstep(
            0.75,
            1.0,
            luminance
        );

    color *= uExposure;
    color = (color - 0.5) * uContrast + 0.5;
    color = mix(color, vec3(0.5), max(uBlack, 0.0) * blacksMask);
    color *= 1.0 + min(uBlack, 0.0) * blacksMask;
    color = mix(color, vec3(1.0), max(uHighlights, 0.0) * highlightsMask);
    color *= 1.0 + min(uHighlights, 0.0) * highlightsMask;
    color = mix(color, vec3(1.0), max(uShadows, 0.0) * shadowsMask);
    color *= 1.0 + min(uShadows, 0.0) * shadowsMask;
    color = mix(color, vec3(1.0), max(uWhites, 0.0) * whitesMask);
    color *= 1.0 + min(uWhites, 0.0) * whitesMask;
    fragColor = vec4(clamp(color, 0.0, 1.0), 1.0);
}
