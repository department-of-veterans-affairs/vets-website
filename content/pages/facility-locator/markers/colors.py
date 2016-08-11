import re


template = open("template.svg").read()

i = 1
for color in ["#E41A1C", "#377EB8", "#4DAF4A", "#984EA3", "#FF7F00",
        "#FFFF33", "#A65628", "#F781BF"]:
    svg = re.sub(r'#COLORGOESHERE', color, template)
    with open("m{}_40.svg".format(i), 'w') as f:
        f.write(svg)
    i += 1
