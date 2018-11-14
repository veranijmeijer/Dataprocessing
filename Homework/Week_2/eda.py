import csv
from pandas import DataFrame
import json
import matplotlib.pyplot as plt
import matplotlib

columns = ["Country", "Region", "Pop. Density (per sq. mi.)", "Infant mortality (per 1000 births)", "GDP ($ per capita) dollars"]

def parse(infile):
    # function loads data from csv file to dataframe
    with open(infile) as input:
        # creates dictionary of information in file
        countries = csv.DictReader(input)
        list_countries = []

        for country in countries:
            missing_info = False
            for column in columns:
                # checks if any column is empty
                if not country[column] or country[column] == "unknown":
                    missing_info = True

            if not missing_info:
                # if no information is missing for this country, it's added to a dictionary
                country_info = {}
                for column in columns:
                    if column == "GDP ($ per capita) dollars":
                        country_info[column] = int(country[column].rstrip()[:-8])
                    elif column == "Country" or column == "Region":
                        country_info[column] = country[column].strip()
                    else:
                        country[column] = float(country[column].replace(",","."))
                        country_info[column] = country[column]

                # every dictionary is added to a list containing dictionaries of every country
                list_countries.append(country_info)

    # creates dataframe
    return DataFrame(list_countries, columns=columns)

def create_json(infile, outfile):
    # function loads data from csv file to json file
    with open(infile) as input:
        # creates dictionary of information in file
        countries = csv.DictReader(input)
        dict_countries = {}

        for country in countries:
            missing_info = False
            for column in columns:
                # checks if any column is empty
                if not country[column] or country[column] == "unknown":
                    missing_info = True

            if not missing_info:
                # if no information is missing for this country, it's added to a dictionary
                country_info = {}
                country_info["Region"] = country["Region"].strip()

                country["Pop. Density (per sq. mi.)"] = float(country["Pop. Density (per sq. mi.)"].replace(",","."))
                country_info["Pop. Density (per sq. mi.)"] = country["Pop. Density (per sq. mi.)"]

                country["Infant mortality (per 1000 births)"] = float(country["Infant mortality (per 1000 births)"].replace(",","."))
                country_info["Infant mortality (per 1000 births)"] = country["Infant mortality (per 1000 births)"]

                country_info["GDP ($ per capita) dollars"] = int(country["GDP ($ per capita) dollars"].rstrip()[:-8])

                dict_countries[country["Country"]] = country_info

        # json file is created
        with open(outfile, "w") as output:
            json.dump(dict_countries, output, indent=4)

# puts data from csv file in a dataframe
data = parse("input.csv")

# creates json file of csv file
create_json("input.csv", "output.json")

# calculate mean, median and mode of GDP
print("mean: ", int(round(data["GDP ($ per capita) dollars"].mean())))
print("median: ", int(round(data["GDP ($ per capita) dollars"].median())))

mode_GDP = data["GDP ($ per capita) dollars"].mode()

# if there is more than 1 mode, it is printed
print("mode: ", end="")
for mode in mode_GDP:
    print(mode)

# create list of bins for histogram
bins = []
i = 0
while i <= 400000:
    bins.append(i)
    i += 5000

# create histogram of GDP
plt.hist(data["GDP ($ per capita) dollars"], bins=bins)
plt.title("Histogram GDP")
plt.xlabel("GDP")
plt.ylabel("Frequency")
fig = plt.gcf()
fig.canvas.set_window_title('Histogram GDP')
plt.show()

# create boxplot of infant mortality
data.boxplot(column="Infant mortality (per 1000 births)")
plt.title("Boxplot Infant mortality")
fig = plt.gcf()
fig.canvas.set_window_title('Boxplot Infant mortality')
plt.show()
