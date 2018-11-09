import csv
import pandas

clean_rows = []

inputfile = open("input.csv", "r")
outputfile = open("output.csv", "w")

for row in inputfile:
    if row != "\n":
        row_csv = [row.rstrip()]
        empty_column = False
        for column in row_csv:
            if not column:
                empty_column = True

        if not empty_column:
            clean_rows.append(row_csv)


writer = csv.writer(outputfile)
for clean_row in clean_rows:
    writer.writerow(clean_row)

inputfile.close()
outputfile.close()
