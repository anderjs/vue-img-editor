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

const vec3 LUMINANCE_WEIGHTS = vec3(0.2126, 0.7152, 0.0722);

float interpolateSegment(
    float value,
    float inputStart,
    float inputEnd,
    float outputStart,
    float outputEnd
) {
    float progress = (value - inputStart) / (inputEnd - inputStart);

    return mix(outputStart, outputEnd, clamp(progress, 0.0, 1.0));
}

float applyRegionalToneCurve(float value) {
    const float blackPoint = 0.125;
    const float whitePoint = 0.875;
    const float shadowPoint = 0.375;
    const float highlightPoint = 0.625;

    float whiteEnd = 1.0 + min(uWhites, 0.0) * 0.1;
    float blackStart = max(uBlack, 0.0) * 0.1;
    float blackOutput = blackPoint + uBlack * 0.1;
    float whiteOutput = whitePoint + uWhites * 0.1;
    float shadowOutput = shadowPoint + uShadows * 0.125;
    float highlightOutput = highlightPoint + uHighlights * 0.125;

    if (value < blackPoint) {
        return interpolateSegment(value, 0.0, blackPoint, blackStart, blackOutput);
    }

    if (value < shadowPoint) {
        return interpolateSegment(
            value,
            blackPoint,
            shadowPoint,
            blackOutput,
            shadowOutput
        );
    }

    if (value < highlightPoint) {
        return interpolateSegment(
            value,
            shadowPoint,
            highlightPoint,
            shadowOutput,
            highlightOutput
        );
    }

    if (value < whitePoint) {
        return interpolateSegment(
            value,
            highlightPoint,
            whitePoint,
            highlightOutput,
            whiteOutput
        );
    }

    return interpolateSegment(value, whitePoint, 1.0, whiteOutput, whiteEnd);
}

void main() {
    vec4 source = texture(uImage, vUv);
    vec3 color = source.rgb * uExposure;

    color = (color - 0.5) * uContrast + 0.5;
    color = max(color, vec3(0.0));

    float luminance = dot(color, LUMINANCE_WEIGHTS);
    float adjustedLuminance = applyRegionalToneCurve(clamp(luminance, 0.0, 1.0));

    if (luminance > 0.00001) {
        color *= adjustedLuminance / luminance;
    } else {
        color = vec3(adjustedLuminance);
    }

    fragColor = vec4(clamp(color, 0.0, 1.0), source.a);
}
