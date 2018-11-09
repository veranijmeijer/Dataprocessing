import csv
import pandas

clean_rows = []

with open("input.csv", "r") as csvfile:
    for row in csvfile:
        if row != "\n":
            row_csv = [row.rstrip()]
        empty_column = False
        for column in row_csv:
            if not column:
                empty_column = True

        if not empty_column and row != "\n":
            clean_rows.append(row_csv)

with open("clean_input.csv", "w") as cleanfile:
    writer = csv.writer(cleanfile)
    for clean_row in clean_rows:
        writer.writerow(clean_row)
