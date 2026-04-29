import requests
from bs4 import BeautifulSoup
from pathlib import Path
import json

URLS = [
    "https://www.fironroofing.ca/",

    # ABOUT US
    "https://www.fironroofing.ca/about-us/",
    "https://fironroofing.ca/about-us/our-process/",
    "https://fironroofing.ca/about-us/reviews/",
    "https://fironroofing.ca/about-us/community-outreach/",
    "https://fironroofing.ca/about-us/awards-and-associations/",

    # WHY US
    "https://fironroofing.ca/why-us/core-values/",
    "https://fironroofing.ca/why-us/top-2-percent-of-roofers/",
    "https://fironroofing.ca/why-us/only-the-best/",
    "https://fironroofing.ca/why-us/detail-fanatics/",
    "https://fironroofing.ca/why-us/five-star-service/",

    # CONTACT US
    "https://fironroofing.ca/contact-us/",
    "https://fironroofing.ca/request-a-free-quote/",
    
    # SERVICE AREAS
    "https://www.fironroofing.ca/service-areas/ottawa/",
    "https://www.fironroofing.ca/service-areas/gatineau/",
    "https://www.fironroofing.ca/service-areas/orleans/",
    "https://www.fironroofing.ca/service-areas/riverside-south/",
    "https://www.fironroofing.ca/service-areas/stittsville/",
    "https://www.fironroofing.ca/service-areas/kanata/",
    "https://www.fironroofing.ca/service-areas/barrhaven/",
    "https://www.fironroofing.ca/service-areas/nepean/",
    "https://www.fironroofing.ca/service-areas/greely-on/",
    "https://www.fironroofing.ca/service-areas/manotick/",
    "https://www.fironroofing.ca/service-areas/glebe/",
    "https://www.fironroofing.ca/service-areas/westboro/",

    # SERVICES
    "https://www.fironroofing.ca/roof-replacement/",
    "https://fironroofing.ca/roof-replacement/lifetime-architectural-shingles/",
    "https://fironroofing.ca/roof-replacement/lifetime-designer-shingles/",

    "https://www.fironroofing.ca/roof-repair/",
    "https://fironroofing.ca/roof-repair/wind-damage/",
    "https://fironroofing.ca/roof-repair/flashing-repairs/",
    "https://fironroofing.ca/roof-repair/ventilation-issues/",

    "https://www.fironroofing.ca/roof-maintenance/",
    "https://fironroofing.ca/roof-maintenance/roof-tune-up/",
    "https://fironroofing.ca/roof-maintenance/snow-and-ice-removal/",
    "https://fironroofing.ca/roof-maintenance/ventilation-upgrades/",

    "https://fironroofing.ca/skylights-and-accessories/",

    # FOR BUSINESSES
    "https://fironroofing.ca/for-businesses/business-overview/",
    "https://fironroofing.ca/for-businesses/property-owners/",
    "https://fironroofing.ca/for-businesses/property-managers/",

    # RESOURCES
    "https://fironroofing.ca/insurance-and-restoration/",
    "https://fironroofing.ca/financing/",
    "https://fironroofing.ca/resources/frequently-asked-questions/",
    "https://fironroofing.ca/employment/",

    # BLOG
    "https://www.fironroofing.ca/blog/",

]

def scrape_page(url):
    resp = requests.get(url, timeout=10)
    soup = BeautifulSoup(resp.text, 'html.parser')
    # remove script and style elements
    for script in soup(["script", "style"]):
        script.decompose()
    text = soup.get_text(separator="\n")
    lines = (line.strip() for line in text.splitlines())
    chunks = "\n".join(line for line in lines if line)
    return {"url": url, "text": chunks}

data = []
for url in URLS:
    print(f"Scraping {url}")
    data.append(scrape_page(url))

with open("firon_knowledge.json", "w") as f:
    json.dump(data, f, indent=2)
print("Saved firon_knowledge.json")