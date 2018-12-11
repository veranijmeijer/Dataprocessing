# Name: Vera Nijmeijer
# Student ID: 10753567

import csv
import json

def create_json(infile, outfile):
    # function loads data from csv (or txt) file to json file

    with open(infile) as input:
        # saves first row as fieldnames
        names = input.readline().strip().split(',')
        fieldnames = []
        # dict_of_dict_countries = {}
        dict_countries = {}

        # removes "" from fieldnames
        for name in names:
            fieldnames.append(name[1:-1])

        # extracts information from csv file into dictionary
        countries = csv.DictReader(input, fieldnames=fieldnames)

        for country in countries:
            if country["Country"] in dict_countries:
                if country["Indicator"] in dict_countries[country["Country"]]:
                    dict_countries[country["Country"]][country["Indicator"]][country["Inequality"]] = float(country["Value"])
                else:
                    dict_countries[country["Country"]][country["Indicator"]] = {country["Inequality"] : float(country["Value"])}
            else:
                dict_countries[country["Country"]] = {country["Indicator"] : float(country["Value"])}
                dict_countries[country["Country"]][country["Indicator"]] = {country["Inequality"] : float(country["Value"])}

        # create JSON file
        with open(outfile, "w") as output:
            json.dump(dict_countries, output, indent=4)

create_json("input.csv", "output.json")
