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
        dict_dates = []

        # removes "" from fieldnames
        for name in names:
            fieldnames.append(name[1:-1])

        # extracts information from csv file into dictionary
        dates = csv.DictReader(input, fieldnames=fieldnames)

        for date in dates:
            date["LOCATION"] = date["LOCATION"].strip()
            if date["Value"] and date["LOCATION"] == "WLD" and date["MEASURE"] == "KTOE":
                date_info = {}


                # makes dictionary with the information about this date
                for fieldname in fieldnames:
                    date_info[fieldname] = date[fieldname].strip()

                dict_dates.append(date_info)

        # create JSON file
        with open(outfile, "w") as output:
            json.dump(dict_dates, output, indent=4)

create_json("data.csv", "data.json")
