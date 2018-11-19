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
                names = ["DDVEC", "FHVEC", "FG", "FHX", "FHXH", "FHN", "FHNH", "FXX", "FXXH", "TG", "TN", "TNH", "TX", "TXH", "T10N", "T10NH", "SQ", "SP", "Q", "DR", "RH", "RHX", "RHXH", "PG", "PX", "PXH", "PN", "PNH", "VVN", "VVNH", "VVX", "VVXH", "NG", "UG", "UX", "UXH", "UN", "UNH", "EV24"]

                index = 2
                for name in names:
                    dict_info[name] = line[index]
                    index += 1

                dict_dates[line[1]] = dict_info

        with open(outfile, "w") as output:
            json.dump(dict_dates, output, indent=4)

create_json("KNMI_20171231.txt", "output.json")
