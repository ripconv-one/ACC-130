import ast
import operator


OPERATORS = {
    ast.Add: operator.add,
    ast.Sub: operator.sub,
    ast.Mult: operator.mul,
    ast.Div: operator.truediv,
    ast.FloorDiv: operator.floordiv,
    ast.Mod: operator.mod,
    ast.Pow: operator.pow,
    ast.USub: operator.neg,
    ast.UAdd: operator.pos,
}


def calculate(expression: str) -> str:
    tree = ast.parse(
        expression,
        mode="eval",
    )

    result = _evaluate(tree.body)

    return str(result)


def _evaluate(node):
    if isinstance(node, ast.Constant):
        if isinstance(node.value, (int, float)):
            return node.value

        raise ValueError(
            "Only numbers are allowed."
        )

    if isinstance(node, ast.BinOp):
        operator_function = OPERATORS.get(
            type(node.op)
        )

        if operator_function is None:
            raise ValueError(
                "Unsupported operator."
            )

        left = _evaluate(node.left)
        right = _evaluate(node.right)

        return operator_function(
            left,
            right,
        )

    if isinstance(node, ast.UnaryOp):
        operator_function = OPERATORS.get(
            type(node.op)
        )

        if operator_function is None:
            raise ValueError(
                "Unsupported operator."
            )

        return operator_function(
            _evaluate(node.operand)
        )

    raise ValueError(
        "Unsupported expression."
    )