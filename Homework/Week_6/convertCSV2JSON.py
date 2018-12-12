# Name: Vera Nijmeijer
# Student ID: 10753567
# Assignment minor Programmeren UvA

import csv
import json

def create_json(infiles, outfile):
    # function loads data from csv (or txt) file to json file
    complete_dictionary = {}
    for infile in infiles:
        with open(infile) as input:
            # saves first row as fieldnames
            names = input.readline().strip().split(',')
            fieldnames = []
            # dict_of_dict_countries = {}
            dict_countries = {}

            # removes "" from fieldnames
            for name in names:
                fieldnames.append(name[1:-1])

            fieldnames[0] = "LOCATION"

            # extracts information from csv file into dictionary
            countries = csv.DictReader(input, fieldnames=fieldnames)


            for country in countries:
                print(country["LOCATION"])
                if country["LOCATION"] in dict_countries:
                    if country["Indicator"] in dict_countries[country["LOCATION"]]:
                        dict_countries[country["LOCATION"]][country["Indicator"]][country["Inequality"]] = float(country["Value"])
                    else:
                        dict_countries[country["LOCATION"]][country["Indicator"]] = {country["Inequality"] : float(country["Value"])}
                else:
                    dict_countries[country["LOCATION"]] = {country["Indicator"] : float(country["Value"])}
                    dict_countries[country["LOCATION"]][country["Indicator"]] = {country["Inequality"] : float(country["Value"])}
            complete_dictionary[infile[5:-4]] = dict_countries
        # create JSON file
        with open(outfile, "w") as output:
            json.dump(complete_dictionary, output, indent=4)

create_json(["Data/2013.csv", "Data/2014.csv", "Data/2015.csv", "Data/2016.csv", "Data/2017.csv"], "Data/output.json")
# create_json("Data/input2016.csv", "Data/output2016.json")
# create_json("Data/input2015.csv", "Data/output2015.json")
# create_json("Data/input2014.csv", "Data/output2014.json")
# create_json("Data/input2013.csv", "Data/output2013.json")
