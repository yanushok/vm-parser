"use strict";

var _index = require("./index");

const code = `
# Нумерация строк в программе начинается с 1. Для того чтобы завершить программу на передать управление на строку с номером 0. 
function main    # функция, с которой начинается выполнение программы
   push 3           # оператор push кладет на вершину стэка целое число или значение переменной 
   call factorial   # вызов функции факториала с параметров 3
   callext out      # вызов внешней функции вывода на консоль числа, которое находится на вершине стэка
   end              # завершение исполнения

function factorial
   dup               # продублируем вершину стэка
   push 1          # положим в стэк 1
   ifeq lbl            # проверим является ли значение первого и единственного аргумента равным единицы, если да, тогда переходим к метки возврата
   dup               # не равен единице, значит продублируем его значение опять на вершине стэка - первый аргумент для sub
   push 1          # положим в стэк 1 - второй аргумент для sub
   sub               # уменьшим значение копии первого аргумента на единицу  
   call factorial  # вызовем рекурсивного факториал для полученной разницы
   mul               # получим произведение первого аргумента, т.е. n, на n-1, полученное после предыдущего вызова оператора.
lbl:
   ret        # возвращаем управление в вызывающую функцию
`; // const code = `
// # Нумерация строк в программе начинается с 1. Для того чтобы завершить программу на передать управление на строку с номером 0. 
// function main    # функция, с которой начинается выполнение программы
//    push 5           # оператор push кладет на вершину стэка целое число или значение переменной
//    push 3           # оператор push кладет на вершину стэка целое число или значение переменной
//    push 1           # оператор push кладет на вершину стэка целое число или значение переменной
//    push 8           # оператор push кладет на вершину стэка целое число или значение переменной
//    callext out
//    end            # завершение исполнения
// `;

(0, _index.parser)(code).interpret();