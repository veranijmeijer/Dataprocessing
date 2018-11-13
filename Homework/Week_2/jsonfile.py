import csv
from pandas import DataFrame
import json

def create_json(infile, outfile):
    columns = ["Country", "Region", "Pop. Density (per sq. mi.)", "Infant mortality (per 1000 births)", "GDP ($ per capita) dollars"]

    with open(infile) as input:
        countries = csv.DictReader(input)
        dict_countries = {}

        for country in countries:
            missing_info = False
            for column in columns:
                if not country[column] or country[column] == "unknown":
                    missing_info = True

            if not missing_info:
                country_info = {}
                country_info["Region"] = country["Region"].strip()

                country["Pop. Density (per sq. mi.)"] = float(country["Pop. Density (per sq. mi.)"].replace(",","."))
                country_info["Pop. Density (per sq. mi.)"] = country["Pop. Density (per sq. mi.)"]

                country["Infant mortality (per 1000 births)"] = float(country["Infant mortality (per 1000 births)"].replace(",","."))
                country_info["Infant mortality (per 1000 births)"] = country["Infant mortality (per 1000 births)"]

                country_info["GDP ($ per capita) dollars"] = int(country["GDP ($ per capita) dollars"].rstrip()[:-8])

                dict_countries[country["Country"]] = country_info

        with open(outfile, "w") as output:
            json.dump(dict_countries, output, indent=4)

    return DataFrame(dict_countries, columns=columns)

create_json("input.csv", "output.json")
