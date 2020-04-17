--
-- PostgreSQL database dump
--

-- Dumped from database version 12.1
-- Dumped by pg_dump version 12.1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: recipes; Type: TABLE; Schema: public; Owner: calistanguyen
--

CREATE TABLE public.recipes (
    user_id integer NOT NULL,
    recipe_ids integer[]
);


ALTER TABLE public.recipes OWNER TO calistanguyen;

--
-- Name: users; Type: TABLE; Schema: public; Owner: calistanguyen
--

CREATE TABLE public.users (
    user_id integer NOT NULL,
    firstname character varying(20) NOT NULL,
    lastname character varying(20) NOT NULL,
    password character varying(20) NOT NULL
);


ALTER TABLE public.users OWNER TO calistanguyen;

--
-- Name: users_user_id_seq; Type: SEQUENCE; Schema: public; Owner: calistanguyen
--

CREATE SEQUENCE public.users_user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_user_id_seq OWNER TO calistanguyen;

--
-- Name: users_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: calistanguyen
--

ALTER SEQUENCE public.users_user_id_seq OWNED BY public.users.user_id;


--
-- Name: users user_id; Type: DEFAULT; Schema: public; Owner: calistanguyen
--

ALTER TABLE ONLY public.users ALTER COLUMN user_id SET DEFAULT nextval('public.users_user_id_seq'::regclass);


--
-- Data for Name: recipes; Type: TABLE DATA; Schema: public; Owner: calistanguyen
--

COPY public.recipes (user_id, recipe_ids) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: calistanguyen
--

COPY public.users (user_id, firstname, lastname, password) FROM stdin;
\.


--
-- Name: users_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: calistanguyen
--

SELECT pg_catalog.setval('public.users_user_id_seq', 1, false);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: calistanguyen
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (user_id);


--
-- PostgreSQL database dump complete
--

