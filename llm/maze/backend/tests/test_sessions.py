from app.sessions import SessionStore


def test_get_or_create_returns_stable_session() -> None:
    store = SessionStore(max_turns=10)
    s1 = store.get_or_create("abc")
    s2 = store.get_or_create("abc")
    assert s1 is s2
    assert s1.id == "abc"


def test_new_session_gets_generated_id() -> None:
    store = SessionStore(max_turns=10)
    s = store.get_or_create(None)
    assert s.id


def test_sessions_are_isolated() -> None:
    store = SessionStore(max_turns=10)
    a = store.get_or_create("a")
    b = store.get_or_create("b")
    store.append(a, "user", "hello from a")
    assert store.history(a) == [{"role": "user", "content": "hello from a"}]
    assert store.history(b) == []


def test_turn_count_counts_user_turns_only() -> None:
    store = SessionStore(max_turns=10)
    s = store.get_or_create("s")
    store.append(s, "user", "hi")
    store.append(s, "assistant", "hello")
    store.append(s, "user", "again")
    assert store.turn_count(s) == 2
