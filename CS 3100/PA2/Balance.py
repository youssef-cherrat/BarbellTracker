# CS3100 - Spring 2024 - Programming Assignment 2
#################################
# Collaboration Policy: You may discuss the problem and the overall
# strategy with up to 4 other students, but you MUST list those people
# in your submission under collaborators.  You may NOT share code,
# look at others' code, or help others debug their code.  Please read
# the syllabus carefully around coding.  Do not seek published or online
# solutions for any assignments. If you use any published or online resources
# (which may not include solutions) when completing this assignment, be sure to
# cite them. Do not submit a solution that you are unable to explain orally to a
# member of the course staff.
#################################
# Your Computing ID: jja3em
# Collaborators: None
# Sources: Introduction to Algorithms, Cormen
#################################

class Balance:

    def __init__(self):
        self.BR = 0


    # This is the method that should run the computation
    # of the balance score for the bookshelf.  You should
    # write an additional recursive method that compute
    # calls.  Your method may have different return values.
    #
    # @return The balance score for the bookshelf.

    # #A modified merge sort that returns the merged list and the balance score of the left and right
    # #split the book shelf into two halves and recursively call the function on the two halves
    # #(conquer), apply aglorithm to sort, also calculate the balance score of the left and right
    # #When merging, BL is calculated by, for each book in the right half, count the number of books in left half it is greater than - add to BL
    # #BR is calculated by, for each book in the left half, count the number of books in right half it is greater than - add to BR
    # #(combine)add BL and BR from merge step to get total BL and BR for the bookshelf array
    # def merge(self, bookshelf, temp, left, mid, right):
    #     i, j, k = left, mid + 1, left
    #     BL, BR = 0, 0
    #     print(bookshelf)
    #     while i <= mid and j <= right:
    #         print(f"Merging: LeftIndex={i}, RightIndex={j}, LeftValue={bookshelf[i]}, RightValue={bookshelf[j]}")  # New print statement
    #         if bookshelf[i] < bookshelf[j]:
    #             temp[k] = bookshelf[i]
    #             i += 1
    #             #BL +=
    #             print(f"BR incremented: New BR={BR}, because {bookshelf[i - 1]} < {bookshelf[j]}")
    #         elif bookshelf[i] > bookshelf[j]:
    #             temp[k] = bookshelf[j]
    #             j += 1
    #             BR += (j - (mid + 1))
    #             k += 1
    #             print(f"BL incremented: New BL={BL}, because {bookshelf[i]} > {bookshelf[j - 1]}")
    #         else:
    #             temp[k] = bookshelf[i]
    #             i += 1
    #
    #     while i <= mid:
    #         temp[k] = bookshelf[i]
    #         i += 1
    #         k += 1
    #         BR += (j - (mid + 1))
    #     while j <= right:
    #         temp[k] = bookshelf[j]
    #         j += 1
    #         k += 1
    #     for i in range(left, right + 1):
    #         bookshelf[i] = temp[i]
    #     return BL, BR
    #
    # def divide(self, bookshelf, temp, left, right):
    #     if left < right:
    #         middle = (left + right) // 2
    #         BL_left, BR_left = self.divide(bookshelf, temp, left, middle)
    #         BL_right, BR_right = self.divide(bookshelf, temp, middle + 1, right)
    #         BL_merge, BR_merge = self.merge(bookshelf, temp, left, middle, right)
    #         return BL_left + BL_right + BL_merge, BR_left + BR_right + BR_merge
    #     return 0, 0
    #
    # def already_sorted_ascending(self, bookshelf):
    #     return all(bookshelf[i] <= bookshelf[i + 1] for i in range(len(bookshelf) - 1))

    #Use recursion as found in merge sort to split the bookshelf into two halves until the base case is reached which is array size 1
    #take in the array
    def mergeSortCount(self, bookshelf):
        if len(bookshelf) > 1:

            #find partition(middle of the array)
            mid = len(bookshelf) // 2

            #split the array into two halves
            left_half = bookshelf[:mid]
            right_half = bookshelf[mid:]

            #recursively call the function on the two halves
            self.mergeSortCount(left_half)
            self.mergeSortCount(right_half)

            #intialize i, j, k
            k = 0
            #result array
            i = j = 0

            #the way this algorithim works, is when a value in the left half is greater than a value in the right half, we increment BR
            #when a value in the right half is greater than a value in the left half, we increment BL
            #we then add BL and BR to get the total balance score
            while i < len(left_half) and j < len(right_half):
                #array1 equals [1] and array2 equals [2]
                #if the value in array1 is greater than the value in array2, increment BR
                #if the value in array2 is greater than the value in array1, increment BL
                #example2: array1 equals [1, 2, 2] and array2 equals [3, 4]
                #using the while loop, for each value in array1 that is greater than a value in array2, increment BR and for each value in array2 that is greater than a value in array1, increment BL

                # #this says when we compare with left array with right array, if the left array is greater increment BR, increment j
                # if (left_half[i] > right_half[j]) and (right_half[j] != len(right_half)):
                #     print(f"left_half[i] < right_half[j]: {left_half[i]} > {right_half[j]}")
                #     j += 1
                #     self.BR += 1
                #     print(f"BR incremented: New BR={self.BR}, because {left_half[i]} > {right_half[j-1]}")
                # #if the left array is greater, increment BR again, but now, put all values of right array into result array and then left array and then increment i
                # elif left_half[i] > right_half[j] and right_half[j] == len(right_half) - 1:
                #     print(f"left_half[i] > right_half[j]: {left_half[i]} > {right_half[j]}")
                #     self.BR += 1
                #     print(f"BR incremented: New BR={self.BR}, because {left_half[i]} > {right_half[j]}")
                #     for each in right_half:
                #         bookshelf[k] = each
                #         k += 1
                #     bookshelf[k] = left_half[i]
                #     i += 1
                #     k += 1
                # #then add elements to array since left half is less than right half or equal
                # else:
                #     bookshelf[k] = left_half[i]
                #     i += 1
                #     k += 1
                if left_half[i] < right_half[j]:
                    bookshelf[k] = left_half[i]
                    i += 1
                elif left_half[i] > right_half[j]:
                    bookshelf[k] = right_half[j]
                    # For each element in right_half that goes before left_half[i], increment BR
                    print("BR before increment: ", self.BR)
                    self.BR += (len(left_half) - i)
                    print("BR after increment: ", self.BR, "because", left_half[i], ">", right_half[j])
                    j += 1
                else:
                    bookshelf[k] = left_half[i]
                    i += 1
                k += 1

            while i < len(left_half):
                bookshelf[k] = left_half[i]
                i += 1
                k += 1
            while j < len(right_half):
                bookshelf[k] = right_half[j]
                j += 1
                k += 1

        return self.BR, bookshelf

    def compute(self, bookshelf):
        #The balance score is defined as the absolute value of BL - BR
        #The function should return the balance score
        #The function should also sort the bookshelf array in ascending order
        # if the bookshelf is sorted in ascending order, reverse the bookshelf, since it won't work on already sorted bookshelf (the functions sorts any array to ascending order)
        #this is O(n) time complexity but because merge sort is O(nlogn) it is not significant since it is less than O(nlogn)
        # if self.already_sorted_ascending(bookshelf):
        #     bookshelf = bookshelf[::-1]

        BR, sortedbookshelf = self.mergeSortCount(bookshelf)
        return BR, sortedbookshelf
        # balance = abs(BL - BR)
        # return balance




