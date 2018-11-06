#!/usr/bin/env python
# Name:
# Student number:
"""
This script visualizes data obtained from a .csv file
"""

import csv
import matplotlib.pyplot as plt

# Global constants for the input file, first and last year
INPUT_CSV = "movies.csv"
START_YEAR = 2008
END_YEAR = 2018

# Global dictionary for the data
data_dict = {str(key): [] for key in range(START_YEAR, END_YEAR)}

with open(INPUT_CSV, 'r') as csvfile:
    reading = csv.DictReader(csvfile)
    for row in reading:
        # print(row["Rating"])
        # print(row["Year"])
        data_dict[row["Year"]].append(row["Rating"])
        # print(row)

averages = []
for key in data_dict:
    total_movies = 0
    total_rating = 0
    for rating in data_dict[key]:
        total_movies += 1
        total_rating += float(rating)
    average = round(total_rating / total_movies, 1)
    print(average)
    averages.append(average)

if __name__ == "__main__":
    # print(data_dict)

    plt.plot(range(START_YEAR, END_YEAR), averages)
    plt.title("IMDB Ratings")
    plt.ylabel("Average rating")
    plt.xlabel("Year")
    plt.axis([2008, 2017, 0, 10])
    fig = plt.gcf()
    fig.canvas.set_window_title('IMDB Ratings')
    plt.show()
