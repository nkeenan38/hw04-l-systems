#version 300 es
precision highp float;

in vec4 fs_Col;
in vec4 fs_Pos;
in vec4 fs_Nor;

out vec4 out_Col;

void main()
{
	vec4 BROWN = vec4(100.0 /255.0, 80.0 / 255.0, 20.0 / 255.0, 1.0);
	vec4 WHITE = vec4(0.7, 0.75, 0.7, 1.0);
	vec4 color = mix(WHITE, BROWN, (-fs_Nor.y + 0.9) * 0.5);
	out_Col = color;
    // float dist = 1.0 - (length(fs_Pos.xyz) * 2.0);
    // out_Col = vec4(dist) * fs_Col;
}
