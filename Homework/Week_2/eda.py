import csv
from pandas import DataFrame

infile = "input.csv"
columns = ["Country", "Region", "Pop. Density (per sq. mi.)", "Infant mortality (per 1000 births)", "GDP ($ per capita) dollars"]

with open(infile) as input:
    countries = csv.DictReader(input)
    list_countries = []

    for country in countries:
        missing_info = False
        for column in columns:
            if not country[column]:
                missing_info = True
            elif not country[column]:
                missing_info = True
            elif not country[column]:
                missing_info = True
            elif not country[column]:
                missing_info = True
            elif not country[column]:
                missing_info = True

        if not missing_info:
            country_info = {}
            for column in columns:
                country_info[column] = country[column].strip()

            list_countries.append(country_info)

data = DataFrame(list_countries, columns=columns)
print(data)
