import csv
import json

def create_json(infile, outfile):
    # function loads data from csv (or txt) file to json file
    with open(infile) as input:
        dict_dates = {}
        for line in input:
            if not line.strip().startswith("#"):
                line = line.strip().split(',')

                dict_info = {}
                dict_info["STN"] = line[0]
                dict_info["TG"] = line[2]

                dict_dates[line[1]] = dict_info

        with open(outfile, "w") as output:
            json.dump(dict_dates, output, indent=4)

create_json("KNMI_20171231.txt", "output.json")
