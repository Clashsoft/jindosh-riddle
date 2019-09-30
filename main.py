import itertools


class Person:
    def __init__(self, name, city, color, seat, drink, item):
        self.name = name
        self.city = city
        self.color = color
        self.seat = seat
        self.drink = drink
        self.item = item


def are_unique(people, by):
    return len(set(map(people, by))) == len(people)


def when(condition, then):
    def impl(people):
        for person in people:
            if condition(person) and not then(person):
                return False
        return True

    return impl


def same(condition, then):
    def impl(people):
        for person in people:
            if condition(person) != then(person):
                return False
        return True

    return impl


def check_constraints(people, constraints):
    for constraint in constraints:
        if not constraint(people):
            return False
    return True


def print_people(people):
    print("|Name |City |Color|Seat |Drink|Item |")
    print("|-----|-----|-----|-----|-----|-----|")
    for person in people:
        print("|%5s|%5s|%5s|%5d|%5s|%5s|" % (
            person.name, person.city, person.color, person.seat, person.drink, person.item))
    print("|-----|-----|-----|-----|-----|-----|")


def two_cond(cond_a, cond_b, cond_ab):
    def impl(people):
        a = None
        b = None
        for person in people:
            if cond_a(person):
                a = person
            if cond_b(person):
                b = person

        return a and b and cond_ab(a, b)

    return impl


def next_to(cond_a, cond_b):
    return two_cond(cond_a, cond_b, lambda a, b: abs(a.seat - b.seat) == 1)


constraints = [
    # red <=> seat == 2
    same(lambda p: p.color == 're', lambda p: p.seat == 2),
    # green.seat < white.seat # TODO "left of", maybe == white.seat - 1 ?
    two_cond(lambda p: p.color == 'gr', lambda p: p.color == 'wh', lambda a, b: a.seat == b.seat - 1),
    # green <=> absinthe
    same(lambda p: p.color == 'gr', lambda p: p.drink == 'ab'),  #
    # Baleton <=> blue
    same(lambda p: p.city == 'Ba', lambda p: p.color == 'bl'),
    # Baleton next to War Medal
    next_to(lambda p: p.city == 'Ba', lambda p: p.item == 'WM'),
    # LW not from Dunwall
    when(lambda p: p.name == 'LW', lambda p: p.city != 'Du'),
    # Dunwall <=> Bird Penant
    same(lambda p: p.city == 'Du', lambda p: p.item == 'BP'),
    # Fraeport next to Dunwall
    next_to(lambda p: p.city == 'Fr', lambda p: p.city == 'Du'),
    # Dabokva <=> Rum
    same(lambda p: p.city == 'Da', lambda p: p.drink == 'ru'),
    # Center <=> Whiskey
    same(lambda p: p.seat == 3, lambda p: p.drink == 'wh'),
]

if __name__ == '__main__':
    names = ['LW', 'DM', 'CC', 'MN', 'BF']
    cities = ['Ba', 'Du', 'Fr', 'Da', 'Ka']
    colors = ['gr', 'wh', 'bl', 're', 'pu']
    seats = [1, 2, 3, 4, 5]
    drinks = ['ab', 'be', 'wi', 'ru', 'wh']
    items = ['ST', 'WM', 'Di', 'BP', 'Ri']

    #          Name  City  Color Seat  Drink Item
    people = [
        Person('LW', None, None, None, None, 'ST'),
        Person('DM', 'Ka', None, None, None, None),
        Person('CC', None, None,    1, None, None),
        Person('MN', None, 'pu', None, None, None),
        Person('BF', None, None, None, 'wi', None),
    ]

    cities.remove('Ka')
    colors.remove('pu')
    seats.remove(1)
    drinks.remove('wi')
    items.remove('ST')

    counter = 0

    for city_perm in itertools.permutations(cities):
        people[0].city = city_perm[0]
        people[2].city = city_perm[1]
        people[3].city = city_perm[2]
        people[4].city = city_perm[3]

        for color_perm in itertools.permutations(colors):
            people[0].color = color_perm[0]
            people[1].color = color_perm[1]
            people[2].color = color_perm[2]
            people[4].color = color_perm[3]

            for seat_perm in itertools.permutations(seats):
                people[0].seat = seat_perm[0]
                people[1].seat = seat_perm[1]
                people[3].seat = seat_perm[2]
                people[4].seat = seat_perm[3]

                for drink_perm in itertools.permutations(drinks):
                    people[0].drink = drink_perm[0]
                    people[1].drink = drink_perm[1]
                    people[2].drink = drink_perm[2]
                    people[3].drink = drink_perm[3]

                    for item_perm in itertools.permutations(items):
                        people[1].item = item_perm[0]
                        people[2].item = item_perm[1]
                        people[3].item = item_perm[2]
                        people[4].item = item_perm[3]

                        if check_constraints(people, constraints):
                            print_people(people)
                            counter += 1

    print(f"found {counter} solutions in total")
