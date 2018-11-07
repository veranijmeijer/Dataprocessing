#!/usr/bin/env python
# Name: Vera Nijmeijer
# Student number: 10753567
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

    # add ratings to dictionary of that certain year
    for row in reading:
        data_dict[row["Year"]].append(row["Rating"])

# calculate the average rating per year
averages = []
for key in data_dict:
    total_movies, total_rating = 0, 0
    for rating in data_dict[key]:
        total_movies += 1
        total_rating += float(rating)
    averages.append(round(total_rating / total_movies, 1))

if __name__ == "__main__":
    # make a line chart of the average rating per year
    plt.plot(range(START_YEAR, END_YEAR), averages)
    plt.title("IMDB Ratings")
    plt.ylabel("Average rating")
    plt.xlabel("Year")
    plt.axis([2008, 2017, 0, 10])
    fig = plt.gcf()
    fig.canvas.set_window_title('IMDB Ratings')
    plt.show()
