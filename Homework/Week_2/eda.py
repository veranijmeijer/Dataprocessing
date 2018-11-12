import csv
from pandas import DataFrame
import matplotlib.pyplot as plt
import matplotlib

def parse(infile):
    columns = ["Country", "Region", "Pop. Density (per sq. mi.)", "Infant mortality (per 1000 births)", "GDP ($ per capita) dollars"]

    with open(infile) as input:
        countries = csv.DictReader(input)
        list_countries = []

        for country in countries:
            missing_info = False
            for column in columns:
                if not country[column] or country[column] == "unknown":
                    missing_info = True
            #
            # if country["GDP ($ per capita) dollars"] == "400000 dollars":
            #      missing_info = True

            if not missing_info:
                country_info = {}
                for column in columns:
                    if column == "GDP ($ per capita) dollars":
                        country_info[column] = int(country[column].rstrip()[:-8])
                    elif column == "Country" or column == "Region":
                        country_info[column] = country[column].strip()
                    else:
                        country[column] = float(country[column].replace(",","."))
                        country_info[column] = country[column]

                list_countries.append(country_info)

    return DataFrame(list_countries, columns=columns)

data = parse("input.csv")
print(data)
mean_GDP = int(round(data["GDP ($ per capita) dollars"].mean()))
median_GDP = int(round(data["GDP ($ per capita) dollars"].median()))
mode_GDP = data["GDP ($ per capita) dollars"].mode()
# median_GDP = median(data, "GDP ($ per capita) per dollars")
print("mean: ", mean_GDP)
print("median: ", median_GDP)
print("mode: ", end="")
for mode in mode_GDP:
    print(mode)

bins = []
i = 0
while i <= 400000:
    bins.append(i)
    i += 1000

plt.hist(data["GDP ($ per capita) dollars"], bins=bins)
plt.title("Histogram GDP")
plt.xlabel("GDP")
plt.ylabel("Frequency")
plt.show()

data.boxplot(column="Infant mortality (per 1000 births)")
plt.title("Boxplot Infant mortality")
plt.show()

data.to_json("output.json", orient="records")
