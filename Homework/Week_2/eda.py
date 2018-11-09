import csv
import pandas

clean_rows = []

inputfile = open("input.csv", "r")
outputfile = open("output.csv", "w")

inputfile.readline()

for row in inputfile:
    if row != "\n":
        print(row)
        row_csv = row.split()
        print(row_csv)
        empty_column = False
        for column in row_csv:
            if not column:
                empty_column = True

        if not empty_column:
            clean_rows.append(row_csv)


writer = csv.writer(outputfile)
writer.writerow(['Country', 'Region', 'Population', 'Area (sq. mi.)', 'Pop. Density (per sq. mi.)', 'Coastline (coast/area ratio)', 'Net migration', 'Infant mortality (per 1000 births)', 'GDP ($ per capita) dollars', 'Literacy (%)', 'Phones (per 1000)', 'Arable (%)', 'Crops (%)', "Other (%)", "Climate", "Birthrate", "Deathrate", "Agriculture", "Industry", "Service"])
for clean_row in clean_rows:
    # print(clean_row)
    writer.writerow(clean_row)

inputfile.close()
outputfile.close()
