import csv
import pandas

clean_rows = []
with open("input.csv", "r") as csvfile:
    for row in csvfile:
        row = row.rstrip().split(",")
        empty_column = False
        for column in row:
            if not column:
                empty_column = True

        if not empty_column:
            clean_rows.append(row)

with open("clean_input.csv", "w") as cleanfile:
    writer = csv.writer(cleanfile)
    for clean_row in clean_rows:
        writer.writerow(clean_row)
