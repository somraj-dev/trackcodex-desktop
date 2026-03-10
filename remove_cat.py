import re

with open(r'd:\trackcodexBeta\frontend\public\inbox-zero-dark.svg', 'r', encoding='utf-8') as f:
    svg = f.read()

# Remove the large blue octocat path (fill="#1F6FEB")
svg = re.sub(r'<path\s+fill-rule="evenodd"\s+clip-rule="evenodd"\s+d="M270\.086[^"]*"\s+fill="#1F6FEB"/>', '', svg)

with open(r'd:\trackcodexBeta\frontend\public\inbox-zero-dark.svg', 'w', encoding='utf-8') as f:
    f.write(svg)

print("Done - removed octocat path")
